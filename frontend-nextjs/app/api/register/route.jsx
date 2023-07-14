import bcrypt from 'bcrypt'
import prisma from '../../libs/prismadb'
import { NextResponse } from 'next/server'

export async function POST(request){
    const body = await request.json();
    const { first_name, last_name, role, department, email, password } = body;

    console.log(body)

    if(!first_name || !last_name || !role || !department || !email || !password) {
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

    const name = `${first_name} ${last_name}`
    const user = await prisma.user.create({
        data: {
            name,
            firstName: first_name,
            lastName: last_name,
            role,
            department,
            email,
            hashedPassword
        }
    });

    return NextResponse.json(user)
}