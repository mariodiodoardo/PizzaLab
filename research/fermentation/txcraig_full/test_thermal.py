import unittest
from thermal_analysis import thermal_segments,calculate,residuals
from model import progress
class ThermalTests(unittest.TestCase):
    def test_duration(self):
        s=thermal_segments(2,18,3)
        self.assertAlmostEqual(sum(h for h,t in s),23,places=8)
    def test_temperature_bounds(self):
        s=thermal_segments(2,18,3)
        self.assertTrue(all(4<=t<=22 for h,t in s))
    def test_near_instant_approaches_baseline(self):
        r=calculate(.001,.001)
        self.assertTrue(3.5<r['test_grams']<3.9)
    def test_positive_prediction(self):
        self.assertGreater(calculate()['test_grams'],0)
    def test_residuals_sorted(self):
        r=residuals()
        self.assertEqual(len(r),36)
        self.assertGreaterEqual(r[0][0],r[-1][0])
if __name__=='__main__':unittest.main()
