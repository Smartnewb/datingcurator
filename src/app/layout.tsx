import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "데이트 메이트 | 대학생 맞춤 데이트 장소 추천",
  description: "설문 기반으로 나에게 딱 맞는 데이트 장소를 추천받아보세요!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
