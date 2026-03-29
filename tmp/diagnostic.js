import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Prospect from './backend/models/Prospect.js';
import User from './backend/models/User.js';

dotenv.config({ path: './backend/.env' });

async function run() {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const user = await User.findOne({});
        if (!user) {
            console.error('No users found in DB. Can\'t test.');
            process.exit(1);
        }
        console.log('Testing for User ID:', user._id);

        const testProspect = {
            userId: user._id,
            company: "Test Elite Co " + Date.now(),
            domain: "testelite.com",
            status: 'discovered',
            icpScore: null,
            fitReason: 'Testing connection...'
        };

        const created = await Prospect.create(testProspect);
        console.log('✅ PROSPECT CREATED SUCCESS:', created._id);
        
        const count = await Prospect.countDocuments({ userId: user._id });
        console.log('Total for user:', count);

        process.exit(0);
    } catch (err) {
        console.error('❌ FAILED TO CREATE PROSPECT:', err.message);
        if (err.errors) {
            console.error('Validation Errors:', Object.keys(err.errors));
        }
        process.exit(1);
    }
}

run();
