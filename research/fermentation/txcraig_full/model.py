"""Approximate TXCraig table surface; NOT the author's original formula.
Uses 48h CY table as an anchor and a temperature-dependent log-dose slope
estimated from selected visually transcribed cells in the extended chart.
"""
import math
from pathlib import Path
import sys
sys.path.insert(0,str(Path(__file__).resolve().parent))
import contextlib, io
with contextlib.redirect_stdout(io.StringIO()):
    from compare import TABLE48,log_interpolate
# Extended image rows (degrees C): {CY percent: displayed integer hours}.
# Selected cells read manually; rounded to integer hours in original chart.
GRID={
 4.4:{.2:130,.3:97,.5:67,1.:40,2.:24,3.:18},
 10.0:{.05:143,.1:86,.2:52,.3:39,.5:27,1.:16,2.:10,3.:7},
 15.0:{.02:139,.05:71,.1:43,.2:29,.3:19,.5:13,1.:8,2.:5,3.:4},
 20.0:{.01:120,.02:73,.05:37,.1:25,.2:14,.3:11,.5:8,1.:4,2.:3,3.:2},
 22.2:{.01:83,.02:50,.05:26,.1:17,.2:10,.3:7,.5:5,1.:3,2.:2,3.:1},
 25.0:{.01:56,.02:34,.05:17,.1:10,.2:6,.3:5,.5:3,1.:2},
}
def slope_for_row(temp, cells):
    # Fit around 48h when possible, excluding times < 8h (heavy rounding).
    dose48=log_interpolate(temp)
    pairs=sorted((abs(math.log(dose/dose48)),dose,hours) for dose,hours in cells.items() if hours>=8)
    near=sorted(pairs[:min(5,len(pairs))],key=lambda p:p[1])
    x=[math.log(p[1]/dose48) for p in near]
    y=[math.log(p[2]/48) for p in near]
    # Regression through origin, 48h-table is an anchor.
    return -sum(a*b for a,b in zip(x,y))/sum(a*a for a in x)
SLOPES={t:slope_for_row(t,c) for t,c in GRID.items()}
def lerp(xs, x):
    xs=sorted(xs)
    if x<=xs[0][0]:return xs[0][1]
    if x>=xs[-1][0]:return xs[-1][1]
    for (x0,y0),(x1,y1) in zip(xs,xs[1:]):
        if x0<=x<=x1:return y0+(x-x0)*(y1-y0)/(x1-x0)
def alpha(temp):return lerp(list(SLOPES.items()),temp)
def hours(temp,cy_percent):
    if not 1.7<=temp<=26.7:raise ValueError('temperature outside supplied chart')
    if cy_percent<=0:raise ValueError('yeast must be positive')
    return 48*(cy_percent/log_interpolate(temp))**(-alpha(temp))
def progress(segments,cy_percent):
    return sum(duration/hours(temp,cy_percent) for duration,temp in segments)
def solve(segments):
    lo,hi=.0001,10.
    for _ in range(100):
        mid=(lo+hi)/2
        if progress(segments,mid)<1:lo=mid
        else:hi=mid
    return (lo+hi)/2
# For direct comparability, first phases are assumed at 22C, instant temperature changes.
REF=[(2+10/60,22),(25,4),(3.5,22)]
TEST=[(2+10/60,22),(17.5,4),(3,22)]
def show():
    print('TXCraig approximate surface; CY fresh yeast percent')
    print('Temperature slopes:',{t:round(a,3) for t,a in SLOPES.items()})
    for t in [4.4,10,15,20,22.2,25]:
        print('48h anchor',t,round(log_interpolate(t),4),'%', 'model',round(hours(t,log_interpolate(t)),2),'h')
    print('Uncalibrated table-surface #001 dose',round(solve(REF),4),'% /',round(964*solve(REF)/100,3),'g')
    print('Uncalibrated table-surface #002 dose',round(solve(TEST),4),'% /',round(963*solve(TEST)/100,3),'g')
    # Calibrate target progress to #001, not the table's independent readiness target.
    target=progress(REF,100*3/964)
    lo,hi=.0001,10
    for _ in range(100):
        mid=(lo+hi)/2
        if progress(TEST,mid)<target:lo=mid
        else:hi=mid
    print('Personal-calibrated #002',round(963*(lo+hi)/200,3),'g; target progress',round(target,3))
    print('Scenario table, 22C ambient, 4C cold, 2h10 initial + 3h30 final:')
    for cold_h in [12,18,25,36,48,72]:
        segments=[(2+10/60,22),(cold_h,4),(3.5,22)]
        uncal=solve(segments)*964/100
        target=progress(REF,100*3/964)
        lo,hi=.0001,10
        for _ in range(80):
            mid=(lo+hi)/2
            if progress(segments,mid)<target:lo=mid
            else:hi=mid
        print(cold_h,'h cold -> uncalibrated',round(uncal,2),'g, personalized',round(964*(lo+hi)/200,2),'g')
    print('Grid cell residuals, predicted hours vs chart hours:')
    errors=[]
    for t,cells in GRID.items():
        for dose,actual in cells.items():
            if actual>=8:
                predicted=hours(t,dose)
                errors.append(abs(predicted-actual)/actual)
    print('median absolute relative deviation',round(sorted(errors)[len(errors)//2]*100,1),'%; max',round(max(errors)*100,1),'%; n',len(errors))
if __name__=='__main__':show()
