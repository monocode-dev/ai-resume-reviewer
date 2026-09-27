export default function buildMeResponse(user: { email: string; plan: string; reviews_used_today: number; usage_reset_date: Date | string }) {
  const limit = user.plan === "pro" ? 5 : 1;
  const isNewDay = new Date(user.usage_reset_date).toDateString() !== new Date().toDateString();
  const reviewsRemainingToday = isNewDay ? limit : Math.max(0, limit - user.reviews_used_today);
  return { email: user.email, plan: user.plan, reviewsRemainingToday };
}