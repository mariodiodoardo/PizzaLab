"""Thermal-lag sensitivity and residual diagnostics for approximate TXCraig surface.
Not an experimentally validated yeast recommendation.
"""
import math
from model import GRID, hours, alpha, log_interpolate, REF, TEST, progress


def residuals():
    out=[]
    for temp, cells in GRID.items():
        for dose, observed in cells.items():
            if observed >= 8:
                predicted=hours(temp,dose)
                out.append((abs(predicted-observed)/observed,temp,dose,observed,predicted))
    return sorted(out,reverse=True)


def thermal_segments(initial_hours, cold_hours, final_hours, room=22.0, fridge=4.0,
                     dough_start=22.0, tau_cool=2.0, tau_warm=1.5, dt=1/60):
    """Newton cooling/warming approximation. Time constants in hours.
    Initial dough starts at dough_start, room exposure then cold then room.
    Returns small constant-temperature segments (hours, C).
    """
    if min(initial_hours,cold_hours,final_hours)<0 or min(tau_cool,tau_warm)<=0:
        raise ValueError('invalid duration or thermal time constant')
    segments=[]
    current=dough_start
    for duration,target,tau in [(initial_hours,room,tau_warm),(cold_hours,fridge,tau_cool),(final_hours,room,tau_warm)]:
        n=max(1,math.ceil(duration/dt))
        h=duration/n
        for _ in range(n):
            end=target+(current-target)*math.exp(-h/tau)
            midpoint=target+(current-target)*math.exp(-h/(2*tau))
            segments.append((h,midpoint))
            current=end
    return segments


def solve_target(segments,target):
    lo,hi=0.00001,10.0
    for _ in range(90):
        mid=(lo+hi)/2
        if progress(segments,mid)<target:lo=mid
        else:hi=mid
    return (lo+hi)/2


def calculate(tau_cool=2.0,tau_warm=1.5,room=22,fridge=4,dough_start=22):
    ref=thermal_segments(2+10/60,25,3.5,room,fridge,dough_start,tau_cool,tau_warm)
    test=thermal_segments(2+10/60,17.5,3,room,fridge,dough_start,tau_cool,tau_warm)
    target=progress(ref,100*3/964)
    return {'ref_progress':target,'test_grams':solve_target(test,target)*963/100,
            'ref_uncalibrated_grams':solve_target(ref,1)*964/100,
            'test_uncalibrated_grams':solve_target(test,1)*963/100}


def show():
    print('Largest in-sample chart residuals (hours rounded in chart):')
    for err,t,d,obs,pred in residuals()[:10]:
        print(f'  T={t:4.1f}C CY={d:.3f}% chart={obs:3d}h predicted={pred:6.1f}h error={err*100:5.1f}%')
    print('\nThermal time constants: cooling/warming in hours; reference calibrated to 3g:')
    for cool,warm in [(0.05,0.05),(1,1),(2,1.5),(3,2),(4,3)]:
        r=calculate(cool,warm)
        print(f'  tau_cool={cool:4.2f} tau_warm={warm:4.2f} -> #002 {r["test_grams"]:.3f}g; raw #001 {r["ref_uncalibrated_grams"]:.3f}g')
    print('\nRoom/fridge sensitivity at tau_cool=2h tau_warm=1.5h (recalibrated #001 at each condition):')
    for room in [18,22,26]:
        for fridge in [3,4,6]:
            r=calculate(room=room,fridge=fridge,dough_start=room)
            print(f'  room={room}C fridge={fridge}C -> #002 {r["test_grams"]:.3f}g')
    print('\nCAUTION: re-calibration at each temperature scenario is for sensitivity only, not real-world dosing.')

if __name__=='__main__':show()
