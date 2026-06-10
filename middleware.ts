// middleware.ts 뼈대 가이드
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    // 기본 response 객체 생성 (쿠키 헤더 주입용)
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // Next.js Middleware 전용 서버 측 Supabase 클라이언트 초기화
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // 🔑 1. 현재 로그인한 유저 세션 정보 가져오기 (가장 확실한 getUser 사용)
    const { data: { user } } = await supabase.auth.getUser();

    // 2. 이동하려는 URL 정보 복사
    const url = request.nextUrl.clone();

    // 🎯 [미션] 로그인 상태(user 존재 여부)에 따른 리다이렉트 분기를 완성해 보세요!

    // 힌트 A: 로그인된 유저가 로그인 페이지('/login')로 들어가려고 할 때
    if (user && url.pathname === "/login") {
        // 메인 홈('/')으로 주소를 바꾼 뒤 리다이렉트 시킵니다.
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    // 힌트 B: 비로그인 유저가 로그인 필수 페이지인 메인 홈('/')으로 접근하려고 할 때
    if (!user && url.pathname === "/") {
        // 🎯 [미션] 여기에 알맞은 이동 경로를 적고 리다이렉트 시키는 코드를 완성해 보세요!
    }

    return response;
}

// 미들웨어가 작동할 경로 패턴 설정 (정적 리소스나 파비콘 등은 가드 제외)
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
