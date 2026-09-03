import {describe,it,expect} from 'vitest'; import {completionPercent} from '@/lib/progress';
describe('progress',()=>{it('calculates completion',()=>expect(completionPercent(3,4)).toBe(75));it('handles empty course',()=>expect(completionPercent(0,0)).toBe(0))});
