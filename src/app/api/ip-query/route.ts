import { NextRequest, NextResponse } from 'next/server';

const APP_ID = 'cykanitnhs6fhpkl';
const APP_SECRET = 'YjDy16L4UGmLRh2OixnHwzlpL3n5BOkw';
const BASE_URL = 'https://www.mxnzp.com/api/ip';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ip = searchParams.get('ip');

  try {
    let url: string;

    if (ip) {
      url = `${BASE_URL}/aim_ip?ip=${ip}&app_id=${APP_ID}&app_secret=${APP_SECRET}`;
    } else {
      url = `${BASE_URL}/self?app_id=${APP_ID}&app_secret=${APP_SECRET}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.code !== 1) {
      return NextResponse.json(
        { error: data.msg || '查询失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data,
    });
  } catch (error) {
    console.error('IP query error:', error);
    return NextResponse.json(
      { error: 'IP查询服务暂时不可用，请稍后重试' },
      { status: 500 }
    );
  }
}
