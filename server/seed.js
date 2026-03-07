const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { sequelize } = require('./config/db');
const { User, Doctor, Specialization, Patient } = require('./models');

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        await sequelize.sync();

        // 1. Create Specializations
        const specs = await Promise.all([
            Specialization.findOrCreate({ where: { name: 'Cardiology' } }),
            Specialization.findOrCreate({ where: { name: 'Dermatology' } }),
            Specialization.findOrCreate({ where: { name: 'Neurology' } }),
            Specialization.findOrCreate({ where: { name: 'Pediatrics' } }),
            Specialization.findOrCreate({ where: { name: 'General Medicine' } }),
        ]);
        console.log('✅ Specializations created.');

        // 2. Create Admin User
        const hashedPass = await bcrypt.hash('admin123', 10);
        const [adminUser] = await User.findOrCreate({
            where: { email: 'admin@clinic.com' },
            defaults: { name: 'Admin User', email: 'admin@clinic.com', password: hashedPass, role: 'admin' }
        });
        console.log('✅ Admin created → email: admin@clinic.com | password: admin123');

        // 3. Create Doctor Users + Doctor Profiles
        const doctors = [
            { name: 'Dr. Sarah Johnson', email: 'sarah@clinic.com', phone: '555-0101', bio: 'Experienced cardiologist with 15 years of practice.', spec: 'Cardiology', days: 'Mon,Tue,Wed,Thu' },
            { name: 'Dr. Michael Chen', email: 'michael@clinic.com', phone: '555-0102', bio: 'Board-certified dermatologist specializing in skin care.', spec: 'Dermatology', days: 'Mon,Wed,Fri' },
            { name: 'Dr. Emily Brown', email: 'emily@clinic.com', phone: '555-0103', bio: 'Neurologist focused on brain and nervous system disorders.', spec: 'Neurology', days: 'Tue,Thu,Sat' },
        ];

        const docPass = await bcrypt.hash('doctor123', 10);

        for (const doc of doctors) {
            const [user] = await User.findOrCreate({
                where: { email: doc.email },
                defaults: { name: doc.name, email: doc.email, password: docPass, role: 'doctor' }
            });

            const spec = specs.find(s => s[0].name === doc.spec);
            await Doctor.findOrCreate({
                where: { user_id: user.id },
                defaults: {
                    user_id: user.id,
                    specialization_id: spec[0].id,
                    phone: doc.phone,
                    bio: doc.bio,
                    available_days: doc.days,
                }
            });
        }
        console.log('✅ Doctors created (password for all: doctor123)');
        console.log('   - sarah@clinic.com (Cardiology)');
        console.log('   - michael@clinic.com (Dermatology)');
        console.log('   - emily@clinic.com (Neurology)');

        console.log('\n🎉 Seeding complete! You can now login with these accounts.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error.message);
        process.exit(1);
    }
};

seed();
