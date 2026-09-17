const bcrypt = require('bcryptjs');
const { User, Specialization, Doctor } = require('../models');

const autoSeed = async () => {
    try {
        const doctorCount = await Doctor.count();
        if (doctorCount > 0) {
            console.log('Database already has doctors. Skipping auto-seed.');
            return;
        }

        console.log('\n🌱 Auto-seeding database with initial data...\n');

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

        // ========== 2. Create Admin User ==========
        const salt = await bcrypt.genSalt(10);
        await User.findOrCreate({
            where: { email: 'admin@mediclinic.com' },
            defaults: {
                name: 'Admin',
                email: 'admin@mediclinic.com',
                password: await bcrypt.hash('admin123', salt),
                role: 'admin',
            }
        });

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
                    user_id: docUser.id,
                    specialization_id: spec.id,
                    phone: doc.phone,
                    bio: doc.bio,
                    available_days: doc.available_days,
                }
            });
        }

        console.log('✅ Auto-seed completed successfully!');
    } catch (error) {
        console.error('❌ Auto-seed failed:', error.message);
    }
};

module.exports = autoSeed;
