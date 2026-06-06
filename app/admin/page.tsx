"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// 가짜 유저 데이터
const fakeUsers = [
  { id: "1", name: "김토스", habit: "매일 물 2L 마시기", rate: "85%", status: "우수" },
  { id: "2", name: "이캐시", habit: "1만보 걷기", rate: "40%", status: "경고" },
  { id: "3", name: "박루틴", habit: "아침 6시 기상", rate: "100%", status: "완벽" },
  { id: "4", name: "최코딩", habit: "1일 1커밋", rate: "15%", status: "위험" },
]

// 차트용 가짜 데이터 (요일별 평균 달성률)
const chartData = [
  { name: "월", 달성률: 45 },
  { name: "화", 달성률: 52 },
  { name: "수", 달성률: 68 },
  { name: "목", 달성률: 74 },
  { name: "금", 달성률: 85 },
  { name: "토", 달성률: 92 },
  { name: "일", 달성률: 98 },
]

export default function AdminPage() {
  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8 bg-gray-50 min-h-screen">

      {/* 1. 헤더 영역 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight"> Habit Quest DASHBOARD</h1>
      </div>

      {/* 2. 통계 요약 카드 (KPI) */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 활성 유저수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248 명</div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">오늘의 평균 달성률</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.5%</div>
            <p className="text-xs text-muted-foreground">+5.4% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">위험 유저 (달성률 30% 미만)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">32 명</div>
            <p className="text-xs text-muted-foreground">푸시 알림 발송 필요</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. 차트 영역 (데이터 시각화) */}
      <Card className="pt-6">
        <CardHeader>
          <CardTitle>요일별 전체 평균 달성률 추이</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="달성률" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 4. 기존 테이블 영역 */}
      <Card>
        <CardHeader>
          <CardTitle>세부 유저 활동 데이터</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">유저 ID</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>도전 중인 습관</TableHead>
                <TableHead className="text-right">달성률</TableHead>
                <TableHead className="text-center">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fakeUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.habit}</TableCell>
                  <TableCell className="text-right font-bold">{user.rate}</TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      user.status === '완벽' || user.status === '우수' ? 'bg-green-100 text-green-700' :
                        user.status === '경고' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  )
}