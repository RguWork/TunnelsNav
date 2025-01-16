import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
from io import BytesIO 

class ResNetClassifier(nn.Module):
    """
    Define ResNet model class
    """
    def __init__(self, num_classes):
        super(ResNetClassifier, self).__init__()
        self.resnet = models.resnet34(pretrained=True) #uses a pretrained resnet34 model from torchvision. testing 18
        #self.resnet.fc = nn.Linear(self.resnet.fc.in_features, num_classes) #change the classification fc layer to have the correct number of classes
        self.resnet.fc = nn.Sequential(
            nn.Dropout(p=0.5), #dropout layer to prevent overfitting. only of the fc layer tho, see if it does anything
            nn.Linear(self.resnet.fc.in_features, num_classes)
        )

    def forward(self, x):
        return self.resnet(x)
    

class_labels = ['B10', 'B10', 'B10', 'B10', 'B10', 'B11', 'B13', 'B13', 'B16', 'B16', 'B16', 'B16', 'B16', 'B16', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B26', 'B26', 'B26', 'B26', 'B2', 'B2', 'B2', 'B2', 'B2', 'B2', 'B32', 'B32', 'B32', 'B32', 'B32', 'B32', 'B32', 'B32', 'B32', 'B32', 'B32', 'B32', 'B32', 'B32', 'B36', 'B36', 'B36', 'B36', 'B36', 'B36', 'B4', 'B4', 'B4', 'B4', 'B56', 'B56', 'B56', 'B5', 'B5', 'B5', 'B5', 'B5', 'B5', 'B5', 'B66', 'B66', 'B66', 'B66', 'B66', 'B66', 'B68', 'B68', 'B68', 'B68', 'B68', 'B68', 'B6', 'B6', 'B6', 'B6', 'B6', 'B6', 'B7', 'B7', 'B7', 'B7', 'B7', 'B7', 'B7', 'B7', 'B7', 'B7', 'B7', 'B7', 'B8', 'B8', 'B9', 'B9', 'B9', 'B9', 'E17', 'E17', 'E17', 'E17', 'E17', 'E17', 'E18', 'E18', 'E19', 'E19', 'E19', 'L1', 'L1', 'S0', 'S0', 'S0', 'S0']

def load_model():
    model = ResNetClassifier(len(class_labels))  
    model.load_state_dict(torch.load("models/best_model7.pth", map_location=torch.device("cpu")))
    model.eval() 
    return model

def predict(model, input_image):
    transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()])


    #this is if the input is in the form of FileStorage, which is what flask turns the formdata input image into.
    if isinstance(input_image, bytes):
        input_image = BytesIO(input_image)


    # image = Image.open("B32Test.png").convert("RGB")
    image = Image.open(input_image).convert("RGB")
    input_tensor = transform(image).unsqueeze(0)  

    with torch.no_grad():
        output = model(input_tensor)
        predictions = torch.nn.functional.softmax(output[0], dim=0)
        final_prediction = torch.argmax(output, dim=1).item()

    #print all predictions. in the og code, we just chose the max confidence label.
    # for idx, prob in enumerate(predictions):
    #     print(f"Class {class_labels[idx]}: {prob:.4f}")

    return(class_labels[final_prediction], predictions[final_prediction])

