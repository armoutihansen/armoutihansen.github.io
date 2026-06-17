"""Generate the hero's prediction data: a logistic-regression classifier's
out-of-sample predicted probabilities on a held-out test set.

Run once; the output (src/data/hero-model.json) is committed and shipped static,
so the site never runs a model at build or request time. The hero visualises
these genuine predictions: a confidence band routes low-confidence cases to
review and lets high-confidence ones through — the precision/coverage trade-off.

Pure standard library (no numpy/sklearn) so it is reproducible anywhere:

    python3 scripts/gen_hero_data.py
"""

import json
import math
import os
import random

random.seed(42)


def sigmoid(z):
    if z >= 0:
        return 1.0 / (1.0 + math.exp(-z))
    ez = math.exp(z)
    return ez / (1.0 + ez)


# --- Simulate a binary classification problem (logistic DGP) ------------------
N, D = 1200, 4
BETA = [1.8, -1.2, 0.9, 0.0]  # last feature uninformative
INTERCEPT = -0.2

X = [[random.gauss(0.0, 1.0) for _ in range(D)] for _ in range(N)]
y = []
for row in X:
    logit = INTERCEPT + sum(BETA[j] * row[j] for j in range(D))
    y.append(1 if random.random() < sigmoid(logit) else 0)

# --- Train / test split -------------------------------------------------------
idx = list(range(N))
random.shuffle(idx)
cut = int(0.6 * N)
train, test = idx[:cut], idx[cut:]

# --- Fit logistic regression by gradient descent ------------------------------
w = [0.0] * (D + 1)  # w[0] is the intercept
LR, ITERS = 0.3, 4000
for _ in range(ITERS):
    grad = [0.0] * (D + 1)
    for i in train:
        row = X[i]
        z = w[0] + sum(w[j + 1] * row[j] for j in range(D))
        err = sigmoid(z) - y[i]
        grad[0] += err
        for j in range(D):
            grad[j + 1] += err * row[j]
    m = len(train)
    for k in range(D + 1):
        w[k] -= LR * grad[k] / m

# --- Predict the held-out test set -------------------------------------------
points, correct = [], 0
for i in test:
    row = X[i]
    p = sigmoid(w[0] + sum(w[j + 1] * row[j] for j in range(D)))
    points.append({"p": round(p, 4), "y": y[i]})
    correct += int((1 if p >= 0.5 else 0) == y[i])

out = {
    "method": "logistic regression",
    "n_test": len(points),
    "accuracy": round(correct / len(test), 4),
    "points": points,
}

os.makedirs("src/data", exist_ok=True)
with open("src/data/hero-model.json", "w") as f:
    json.dump(out, f)

print(f"{out['method']}: n_test={out['n_test']} accuracy={out['accuracy']:.3f}")
