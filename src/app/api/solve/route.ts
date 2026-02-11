import { NextResponse } from 'next/server';
const cubeSolver = require('cube-solver');

export async function POST(request: Request) {
  try {
    const { cubeState } = await request.json();
    // Validates and solves the 54-character string
    const solution = cubeSolver.solve(cubeState);
    return NextResponse.json({ success: true, moves: solution.split(' ') });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid Cube sequence. Please scan again." }, { status: 400 });
  }
}