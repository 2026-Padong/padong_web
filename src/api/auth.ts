import {
  apiDelete,
  apiGet,
  apiPost,
  apiPostMultipart,
  apiPut,
  apiPutMultipart,
} from './client'
import type {
  AdminUpgradeRequest,
  AdminUpgradeResponse,
  JwtToken,
  ReissueRequest,
  ResponseDTO,
  SignUpRequest,
  SignUpResponse,
  UserDetailResponse,
} from './contracts/auth'

// 회원가입 + 로그인 일원화 — multipart로 request JSON(Blob) + (옵션) businessLicense 파일
// 함정: request part는 반드시 Blob({type:'application/json'})으로 감싸야 Spring이 JSON으로 인식
// 함정: Content-Type 헤더 직접 설정 금지 (boundary 누락)
// 함정: part 이름은 백엔드 @RequestPart 와 정확히 일치 ("request", "businessLicense")
export async function signupOrLogin(
  req: Omit<SignUpRequest, 'businessLicenseImageUrl'>,
  businessLicense?: File | null,
): Promise<SignUpResponse> {
  const formData = new FormData()
  formData.append('request', new Blob([JSON.stringify(req)], { type: 'application/json' }))
  if (businessLicense) formData.append('businessLicense', businessLicense)
  const res = await apiPostMultipart<ResponseDTO<SignUpResponse>>('/auth/signup', formData)
  return res.data
}

// refreshToken으로 accessToken 재발급
export async function reissueToken(refreshToken: string): Promise<JwtToken> {
  const res = await apiPost<ResponseDTO<JwtToken>>('/auth/reissue', {
    refreshToken,
  } satisfies ReissueRequest)
  return res.data
}

// userId 조회 (JWT 유효성 가벼운 검증용)
export async function fetchMe(): Promise<number> {
  const res = await apiGet<ResponseDTO<number>>('/auth/me')
  return res.data
}

// 마이페이지 프로필 상세 (nickname, picture, email, role, approved, adminDong)
export async function fetchMeDetail(): Promise<UserDetailResponse> {
  const res = await apiGet<ResponseDTO<UserDetailResponse>>('/auth/me-detail')
  return res.data
}

// 프로필 수정 — multipart: request JSON(Blob) + (옵션) picture 파일
// 백엔드 spec (예정): PUT /auth/me
//   - @RequestPart("request") UpdateProfileRequest { nickname: String }
//   - @RequestPart(value="picture", required=false) MultipartFile picture
//   - response: ResponseDTO<UserDetailResponse>
// 함정: signup 과 동일 — request part 는 Blob({type:'application/json'}), Content-Type 직접 설정 금지.
export interface UpdateProfileRequest {
  nickname: string
}

export async function updateMyProfile(
  req: UpdateProfileRequest,
  picture?: File | null,
): Promise<UserDetailResponse> {
  const formData = new FormData()
  formData.append('request', new Blob([JSON.stringify(req)], { type: 'application/json' }))
  if (picture) formData.append('picture', picture)
  const res = await apiPutMultipart<ResponseDTO<UserDetailResponse>>('/auth/me', formData)
  return res.data
}

// 거주 행정동 변경
export async function updateAdminDong(adminDongId: number): Promise<UserDetailResponse> {
  const res = await apiPut<ResponseDTO<UserDetailResponse>>('/auth/me/admin-dong', {
    adminDongId,
  })
  return res.data
}

// USER → ADMIN 전환 신청 (승인 대기) — multipart로 request JSON(Blob) + businessLicense 파일
export async function upgradeToAdmin(
  req: Omit<AdminUpgradeRequest, 'businessLicenseImageUrl'>,
  businessLicense: File,
): Promise<AdminUpgradeResponse> {
  const formData = new FormData()
  formData.append('request', new Blob([JSON.stringify(req)], { type: 'application/json' }))
  formData.append('businessLicense', businessLicense)
  const res = await apiPostMultipart<ResponseDTO<AdminUpgradeResponse>>(
    '/auth/upgrade-admin',
    formData,
  )
  return res.data
}

// 로그아웃
export async function logoutApi(): Promise<void> {
  await apiPost<ResponseDTO<void>>('/auth/logout', {})
}

// 회원탈퇴 — 백엔드 spec: DELETE /auth/me
export async function withdrawApi(): Promise<void> {
  await apiDelete<ResponseDTO<void>>('/auth/me')
}
