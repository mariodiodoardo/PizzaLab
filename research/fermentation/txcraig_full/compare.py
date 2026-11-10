"""Exploratory TXCraig 48-hour table comparison; not a validated yeast calculator."""
import math
# Manually transcribed CY fresh yeast percent from the supplied 48-hour table.
TABLE48 = [(1.7,1.656),(2.2,1.425),(2.8,1.228),(3.3,1.059),(3.9,.914),(4.4,.792),(5.0,.688),(5.6,.599),(6.1,.524),(6.7,.460),(7.2,.405),(7.8,.359),(8.3,.319),(8.9,.284),(9.4,.254),(10,.227),(10.6,.204),(11.1,.183),(11.7,.164),(12.2,.147),(12.8,.132),(13.3,.118),(13.9,.105),(14.4,.094),(15,.083),(15.6,.074),(16.1,.066),(16.7,.059),(17.2,.053),(17.8,.048),(18.3,.043),(18.9,.040),(19.4,.037),(20,.034),(20.6,.032),(21.1,.031),(21.7,.029),(22.2,.028),(22.8,.027),(23.3,.025),(23.9,.023),(24.4,.020),(25,.017),(25.6,.013),(26.1,.009),(26.7,.005)]
def log_interpolate(t):
    if not TABLE48[0][0] <= t <= TABLE48[-1][0]: raise ValueError('temperature outside table')
    for (a,ya),(b,yb) in zip(TABLE48,TABLE48[1:]):
        if a <= t <= b:
            return math.exp(math.log(ya)+(t-a)/(b-a)*(math.log(yb)-math.log(ya)))
    return TABLE48[-1][1]
def activity(t):
    # If dose is inversely proportional to effective hours, 48h-table dose implies relative activity.
    # This is a hypothesis, not the original TXCraig multi-phase method.
    return log_interpolate(22)/log_interpolate(t)
def q10(t): return 2**((t-22)/10)
def exposure(segments, fn): return sum(h*fn(t) for h,t in segments)
ref=[(2+10/60,22),(25,4),(3.5,22)]
test=[(2+10/60,22),(17.5,4),(3,22)]
# The reference and test initial phases are assumptions, not observed measurements.
for name,fn in [('Q10',q10),('TX48-derived activity',activity)]:
    e0=exposure(ref,fn);e1=exposure(test,fn)
    print(f'{name}: E001={e0:.3f}, E002={e1:.3f}, predicted #002={3*963/964*e0/e1:.3f} g')
print('TX48 table 48h constant temp dose at 4C (interpolated):',round(log_interpolate(4),3),'% fresh yeast')
