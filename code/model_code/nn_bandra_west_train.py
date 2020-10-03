# Python ≥3.5 is required
import sys

# Scikit-Learn ≥0.20 is required
import sklearn

# TensorFlow ≥2.0 is required
import tensorflow as tf
from tensorflow import keras

# Common imports
import numpy as np
import os
from pathlib import Path

# to make this notebook's output stable across runs
np.random.seed(42)
tf.random.set_seed(42)

# To plot pretty figures
import matplotlib as mpl
import matplotlib.pyplot as plt
mpl.rc('axes', labelsize=14)
mpl.rc('xtick', labelsize=12)
mpl.rc('ytick', labelsize=12)


import pandas as pd

df = pd.read_csv('../preparing_data/raw/REFINEDDATA/bandra_west.csv')
data_X = df[['S_D', 'S_M', 'TEMP_C', 'RAIN_MM', 'AQI', 'BANDRA_EAST_M', 'BANDRA_EAST_D', 'BANDRA_EAST_C']]
data_y = df[['MALARIA', 'DENGUE', 'CHICKENGUNIA', 'VIRAL_FEVER', 'FLU', 'TUBERCULOSIS', 'DIARROHEA', 'TYPHOID', 'CHOLERA', 'JAUNDICE']]
modelname = '../model_trained/bandra_west/model_bandra_west.cpkt'

def plot_learning_curves(loss, val_loss):
    plt.plot(np.arange(len(loss)) + 0.5, loss, "b.-", label="Training loss")
    plt.plot(np.arange(len(val_loss)) + 1, val_loss, "r.-", label="Validation loss")
    plt.gca().xaxis.set_major_locator(mpl.ticker.MaxNLocator(integer=True))
    plt.axis([1, 300, 0, 10])
    plt.legend(fontsize=14)
    plt.xlabel("Epochs")
    plt.ylabel("Loss")
    plt.grid(True)

data_X = data_X.astype(float)
data_y = data_y.astype(float)

print(data_X.to_numpy()[300:345].shape)
print(data_y.shape)

train_X = (data_X.to_numpy()[:300]).reshape(300, 1, data_X.shape[1])
train_y = data_y.to_numpy()[:300]

validate_X = (data_X.to_numpy()[300:345]).reshape(45, 1, data_X.shape[1])
validate_y = data_y.to_numpy()[300:345]

test_X = (data_X.to_numpy()[345:]).reshape(data_X.to_numpy()[345:].shape[0], 1, data_X.shape[1])
test_y = data_y.to_numpy()[345:]

print(train_X.shape, train_y.shape, validate_X.shape, validate_y.shape, test_X.shape, test_y.shape)

np.random.seed(42)
tf.random.set_seed(42)

checkpoint_path = modelname
checkpoint_dir = os.path.dirname(checkpoint_path)

# Create a callback that saves the model's weights
cp_callback = tf.keras.callbacks.ModelCheckpoint(filepath=checkpoint_path,save_weights_only=True,verbose=1)


model = keras.models.Sequential([
    keras.layers.GRU(20, return_sequences=True),
    keras.layers.GRU(20, return_sequences=True),
    keras.layers.GRU(20),
    keras.layers.Dense(10)
])

model.compile(loss="mse", optimizer="adam")
history = model.fit(train_X, train_y, epochs=120, validation_data=(validate_X, validate_y), callbacks=[cp_callback])

evaluation_validation = model.evaluate(validate_X, validate_y)
print(evaluation_validation)

evaluation_test = model.evaluate(test_X, test_y)
print(evaluation_test)