"""Alternative interpolation through digitized TXCraig cells, not author's formula."""
import math
from model import GRID,log_interpolate,alpha

def row_hours(temp,dose):
    points={float(d):float(h) for d,h in GRID[temp].items()}
    points[log_interpolate(temp)]=48.0
    pts=sorted((math.log(d),math.log(h)) for d,h in points.items())
    x=math.log(dose)
    for (x0,y0),(x1,y1) in zip(pts,pts[1:]):
        if x0<=x<=x1:
            return math.exp(y0+(x-x0)/(x1-x0)*(y1-y0))
    # Outside observed doses use the original fitted slope, explicitly extrapolated.
    if x<pts[0][0]:return math.exp(pts[0][1]-alpha(temp)*(x-pts[0][0]))
    return math.exp(pts[-1][1]-alpha(temp)*(x-pts[-1][0]))

def hours_piecewise(temp,dose):
    if not 1.7<=temp<=26.7 or dose<=0:raise ValueError('outside supported range')
    temps=sorted(GRID)
    if temp<=temps[0]:
        base=temps[0]
        # Shift effective dose by 48h anchor ratio; extension outside grid temperatures.
        return row_hours(base,dose*log_interpolate(base)/log_interpolate(temp))
    if temp>=temps[-1]:
        base=temps[-1]
        return row_hours(base,dose*log_interpolate(base)/log_interpolate(temp))
    for lo,hi in zip(temps,temps[1:]):
        if lo<=temp<=hi:
            v0=math.log(row_hours(lo,dose*log_interpolate(lo)/log_interpolate(temp)))
            v1=math.log(row_hours(hi,dose*log_interpolate(hi)/log_interpolate(temp)))
            return math.exp(v0+(v1-v0)*(temp-lo)/(hi-lo))

def progress(segments,dose):return sum(h/hours_piecewise(t,dose) for h,t in segments)

def solve(segments,target=1):
    lo,hi=.00001,10.
    for _ in range(80):
        mid=(lo+hi)/2
        if progress(segments,mid)<target:lo=mid
        else:hi=mid
    return (lo+hi)/2

if __name__=='__main__':
    from model import REF,TEST
    from thermal_analysis import thermal_segments
    target=progress(REF,3/964*100)
    print('Piecewise chart-fit (exact on supplied selected chart cells, not independently validated):')
    print('Ref raw g',round(solve(REF)*964/100,3),'test raw g',round(solve(TEST)*963/100,3),'test calibrated g',round(solve(TEST,target)*963/100,3))
    for cool,warm in [(0.05,.05),(1,1),(2,1.5),(3,2),(4,3)]:
        ref=thermal_segments(2+10/60,25,3.5,tau_cool=cool,tau_warm=warm)
        test=thermal_segments(2+10/60,17.5,3,tau_cool=cool,tau_warm=warm)
        target=progress(ref,3/964*100)
        print('tau',cool,warm,'test calibrated',round(solve(test,target)*963/100,3))
