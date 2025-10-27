import numpy as np
import matplotlib.pyplot as plt
import os

os.makedirs("plots", exist_ok=True)

data = np.loadtxt("output.txt", comments="#")
t, x, y = data[:,0], data[:,1], data[:,2]

plt.plot(x, y)
plt.xlabel("X position (m)")
plt.ylabel("Y position (m)")
plt.title("Projectile Motion with Air Resistance")
plt.grid(True)

plt.savefig("plots/projectile_plot.png", dpi=300)
plt.show()
