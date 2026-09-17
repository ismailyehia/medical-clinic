/**
 * Database Seed Script
 * 
 * Creates: 1 Admin, Specializations, and 3 Sample Doctors
 * 
 * Usage:
 *   node seed.js
 * 
 * Make sure your .env file is configured with the correct database credentials.
 */

const bcrypt = require('bcryptjs');
const { connectDB } = require('./config/db');
const { sequelize, User, Specialization, Doctor, Patient } = require('./models');

const seed = async () => {
    try {
        await connectDB();
        await sequelize.sync({ alter: true });

        console.log('\n🌱 Starting database seed...\n');

        // ========== 1. Create Specializations ==========
        const specializations = [
            'General Medicine',
            'Cardiology',
            'Dermatology',
            'Pediatrics',
            'Orthopedics',
            'Neurology',
            'Ophthalmology',
            'ENT (Ear, Nose & Throat)',
            'Gynecology',
            'Dentistry',
        ];

        for (const name of specializations) {
            await Specialization.findOrCreate({ where: { name } });
        }
        console.log(`✅ ${specializations.length} Specializations created`);

        // ========== 2. Create Admin User ==========
        const salt = await bcrypt.genSalt(10);

        const [adminUser] = await User.findOrCreate({
            where: { email: 'admin@mediclinic.com' },
            defaults: {
                name: 'Admin',
                email: 'admin@mediclinic.com',
                password: await bcrypt.hash('admin123', salt),
                role: 'admin',
            }
        });
        console.log('✅ Admin user created');
        console.log('   📧 Email:    admin@mediclinic.com');
        console.log('   🔑 Password: admin123');

        // ========== 3. Create Sample Doctors ==========
        const doctors = [
            {
                name: 'Ahmed Hassan',
                email: 'ahmed@mediclinic.com',
                password: 'doctor123',
                specialization: 'Cardiology',
                phone: '+252-61-1234567',
                bio: 'Board-certified cardiologist with 10+ years of experience in heart health and cardiovascular disease prevention.',
                available_days: 'Monday,Tuesday,Wednesday,Thursday',
            },
            {
                name: 'Fatima Omar',
                email: 'fatima@mediclinic.com',
                password: 'doctor123',
                specialization: 'Pediatrics',
                phone: '+252-61-2345678',
                bio: 'Caring pediatrician specializing in child health, vaccinations, and developmental milestones.',
                available_days: 'Monday,Wednesday,Friday,Saturday',
            },
            {
                name: 'Mohamed Ali',
                email: 'mohamed@mediclinic.com',
                password: 'doctor123',
                specialization: 'General Medicine',
                phone: '+252-61-3456789',
                bio: 'Experienced general practitioner providing comprehensive primary care for patients of all ages.',
                available_days: 'Sunday,Monday,Tuesday,Wednesday,Thursday',
            },
        ];

        for (const doc of doctors) {
            const [docUser] = await User.findOrCreate({
                where: { email: doc.email },
                defaults: {
                    name: doc.name,
                    email: doc.email,
                    password: await bcrypt.hash(doc.password, salt),
                    role: 'doctor',
                }
            });

            const spec = await Specialization.findOne({ where: { name: doc.specialization } });

            await Doctor.findOrCreate({
                where: { user_id: docUser.id },
                defaults: {
                    name: doc.name,
                    user_id: docUser.id,
                    specialization_id: spec.id,
                    phone: doc.phone,
                    bio: doc.bio,
                    available_days: doc.available_days,
                }
            });
        }

        console.log(`✅ ${doctors.length} Doctors created`);
        console.log('   📧 All doctors use password: doctor123');
        console.log('');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  🎉 Seed completed successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');
        console.log('  Login credentials:');
        console.log('  ─────────────────');
        console.log('  Admin:   admin@mediclinic.com   / admin123');
        console.log('  Doctor:  ahmed@mediclinic.com   / doctor123');
        console.log('  Doctor:  fatima@mediclinic.com  / doctor123');
        console.log('  Doctor:  mohamed@mediclinic.com / doctor123');
        console.log('');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        process.exit(1);
    }
};

seed();
