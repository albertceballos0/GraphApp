import numpy as np
from keras import *
from skimage import feature
from sklearn.linear_model import LogisticRegression
import cv2
import os
from sklearn.metrics import classification_report


def resize_and_pad(img, size, pad_color=0):
    h, w = img.shape[:2]
    sh, sw = size

    # Interpolación a usar
    interp = cv2.INTER_AREA if h > sh and w > sw else cv2.INTER_CUBIC

    # Relación de aspecto de la imagen
    aspect = w/h  

    # Cálculo de las dimensiones, manteniendo la relación de aspecto
    if aspect > 1:
        new_w = sw
        new_h = np.round(new_w/aspect).astype(int)
        pad_vert = (sh-new_h)/2
        pad_top, pad_bot = np.floor(pad_vert).astype(int), np.ceil(pad_vert).astype(int)
        pad_left, pad_right = 0, 0
    elif aspect < 1:
        new_h = sh
        new_w = np.round(new_h*aspect).astype(int)
        pad_horz = (sw-new_w)/2
        pad_left, pad_right = np.floor(pad_horz).astype(int), np.ceil(pad_horz).astype(int)
        pad_top, pad_bot = 0, 0
    else:
        new_h, new_w = sh, sw
        pad_left, pad_right, pad_top, pad_bot = 0, 0, 0, 0

    # Escalar y rellenar
    img = cv2.resize(img, (new_w, new_h), interpolation=interp)
    img = cv2.copyMakeBorder(img, pad_top, pad_bot, pad_left, pad_right, borderType=cv2.BORDER_CONSTANT, value=pad_color)

    return img


def read_images(folder_path,color=cv2.COLOR_RGB2BGR, resize=True, size=(260, 260)):
    images = []
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith(('.jpg', '.png')):
                image_path = os.path.join(root, file)
                image = cv2.imread(image_path)
                if resize:
                    image = resize_and_pad(image, size)

                image = cv2.cvtColor(image, color)
                images.append(image)
    return images
class LSPModel:

    
    def __init__(self, radius=3, n_points=8, method='uniform', modelo='nn'):
                    # Definir el modelo de red neuronal
        neuronal_network = Sequential([
            layers.Dense(32, input_shape=(10,), activation='relu'),
            layers.Dense(16, activation='relu'),
            layers.Dense(16, activation='relu'),
            layers.Dense(1, activation='sigmoid')  # Capa de salida con activación sigmoid para clasificación binaria
        ])

        # Compilar el modelo
        neuronal_network.compile(optimizer='rmsprop',
                    loss='binary_crossentropy',
                    metrics=['accuracy'])
        
        self.radius = radius
        self.n_points = n_points
        self.method = method
        self.lbp_array = []
        self.neuronal_network = neuronal_network
        self.histograma = []
        self.model = modelo
        
        
    def save(self, file_path):
        self.neuronal_network.save(file_path)
        
    def fit(self, X, y):
        false_images = read_images("../backend/fileRecognition/trainFaces", color=cv2.COLOR_BGR2GRAY)
        false_images = np.array(false_images)


        X_train = np.concatenate([X, false_images[:X.shape[0]]])
        y_train = np.concatenate([y, np.zeros(X.shape[0])])
 
        self.lbp_array = []
        self.histograma = []
        for image in X_train:
            image = image.astype('uint8')
            lbp = feature.local_binary_pattern(image, self.n_points, self.radius)
            self.lbp_array.append(lbp)
            hist, _ = np.histogram(lbp, bins=np.arange(0, self.n_points + 3), range=(0, self.n_points + 2))
            hist = hist.astype("float")
            # Normalizar el histograma
            hist /= (hist.sum() + 1e-7)
            self.histograma.append(hist)
        self.lbp_array = np.array(self.lbp_array)
        self.histograma = np.array(self.histograma)
        print(self.histograma.shape, y_train.shape)
        
        if self.model == 'nn':
            print("empezando a crear modelo")
            self.neuronal_network.fit(self.histograma, y_train, epochs=400)
        elif self.model == 'lr':
            m = LogisticRegression()
            m.fit(self.histograma, y_train)
        
    def load_model(self, file_path):
        self.neuronal_network = models.load_model(file_path)
    
    def predict(self, X):
        lbp_array = []
        hist = []
        for image in X:
            image = image.astype('uint8')
            lbp = feature.local_binary_pattern(image, self.n_points, self.radius)
            lbp_array.append(lbp)
            histograma, _ = np.histogram(lbp, bins=np.arange(0, self.n_points + 3), range=(0, self.n_points + 2))
            histograma = histograma.astype("float")
            # Normalizar el histograma
            histograma /= (histograma.sum() + 1e-7)
            hist.append(histograma)
        lbp_array = np.array(lbp_array)
        hist = np.array(hist)
        print(hist.shape)
        return self.neuronal_network.predict(hist)

    


