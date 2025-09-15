export function getPaginationMeta(page: number, limit: number, total: number) {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
    };
}

export function sanitizeUser(user: any) {
    const { password, otp, otpExpiry, ...sanitized } = user;
    return sanitized;
}

export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOTPExpiry(minutes: number = 10): Date {
    return new Date(Date.now() + minutes * 60 * 1000);
}
