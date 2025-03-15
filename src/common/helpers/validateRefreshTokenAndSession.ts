import { ResultStatus } from '../result/resultCode'
import { deviceSessionsRepository } from '../../devices/DeviceSessionsRepository'
import { jwtService, RefreshTokenPayload } from '../adapters/jwt.service'
import { Result } from '../result/result.type'
import { WithId } from 'mongodb'
import { DeviceSessionDB } from '../../devices/device-session-types'

export const validateRefreshTokenAndSession = async (
  refreshToken: string,
): Promise<Result<{ decoded: RefreshTokenPayload; session: WithId<DeviceSessionDB> } | null>> => {
  const decoded = jwtService.verifyRefreshToken(refreshToken)
  if (!decoded || !decoded.exp || !decoded.iat) {
    return {
      status: ResultStatus.Unauthorized,
      errorMessage: 'Invalid refresh token',
      data: null,
      extensions: [{ field: 'refreshToken', message: 'Refresh token is invalid' }],
    }
  }

  const session = await deviceSessionsRepository.findSessionByDeviceIdAndUserId(
    decoded.deviceId,
    decoded.userId,
  )

  if (!session) {
    return {
      status: ResultStatus.Unauthorized,
      errorMessage: 'Invalid device or session not found',
      data: null,
      extensions: [{ field: 'deviceId', message: 'Session not found' }],
    }
  }

  if (session.lastActiveDate !== decoded.iat * 1000) {
    return {
      status: ResultStatus.Unauthorized,
      errorMessage: 'Invalid last active date',
      data: null,
      extensions: [{ field: 'lastActiveDate', message: 'Last active date mismatch' }],
    }
  }

  return {
    status: ResultStatus.Success,
    data: { decoded, session },
    extensions: [],
  }
}
