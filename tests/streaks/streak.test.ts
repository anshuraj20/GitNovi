import {describe,it,expect} from 'vitest'; import {calculateStreak} from '@/lib/streaks';
describe('streaks',()=>{it('counts consecutive dates including today',()=>expect(calculateStreak(['2026-08-25','2026-08-24','2026-08-23'],'2026-08-25')).toBe(3));it('stops at a gap',()=>expect(calculateStreak(['2026-08-25','2026-08-23'],'2026-08-25')).toBe(1))});
