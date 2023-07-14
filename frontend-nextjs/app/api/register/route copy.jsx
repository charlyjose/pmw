import bcrypt from 'bcrypt'
import prisma from '../../libs/prismadb'
import { NextResponse } from 'next/server'

export async function POST(request){
    const body = await request.json();
    const { name, email, password } = body;

    console.log(body)

    if(!name || !email || !password) {
        return new NextResponse('Missing Fields', { status: 400 })
    }

    const exist = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if(exist) {
        return NextResponse.json({ message: 'Email already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role = "STUDENT"
    const user = await prisma.user.create({
        data: {
            name,
            email,
            role,
            hashedPassword
        }
    });

    return NextResponse.json(user)
}