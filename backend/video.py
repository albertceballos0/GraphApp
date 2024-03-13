import asyncio
import socketio 
from aiortc import RTCPeerConnection, RTCSessionDescription, VideoStreamTrack
import cv2
import numpy as np
import os
import time
import model

token = None
name = None
user = None
sio = socketio.AsyncClient()
async def connect_to_server():
    await sio.connect('http://localhost:3000')
    print("Connected to server")

async def disconnect_from_server():
    await sio.disconnect()

async def close_peer_connection(pc):
    if pc:
        await pc.close()
        print("RTCPeerConnection closed")

async def restart_file():
    await close_peer_connection(pc)
    print("Restarting file...")
    await asyncio.sleep(1)  
    await main()

@sio.on('message')
async def on_message(data):
    message_type = data.get('type')
    if message_type == 'offer':
        global name, token, user
        name = data.get('name')
        token = data.get('token')
        user = data.get('user')
        print("offer", token, data.get('name'))
        await handle_offer(data)

@sio.on('prepared')
async def on_prepared(data):
    if data.get('message') == 'python': 
        return -1
    print("Prepared to receive offer")
    await sio.emit('prepared', { 'message' : 'python'})

async def handle_offer(data):
    offer = RTCSessionDescription(sdp=data['sdp'], type=data['type'])
    await pc.setRemoteDescription(offer)
    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    await sio.emit('message', {'type': 'answer', 'sdp': pc.localDescription.sdp, 'token': data['token']})

async def on_track(track):
    print("Received video track", name, user)    
    if not os.path.exists(f'./fileRecognition/{user}/{name}'):
        os.makedirs(f'./fileRecognition/{user}/{name}')
        print(f"Folder created.")
    else:
        print(f"Folder∫s already exists.")
    frame_count = 0
    
    start_time = time.time()
    total_time = time.time()
    img = []
    while time.time() - total_time < 10:
        try:
            frame = await track.recv()
            image = frame.to_image()
            image = np.array(image)

            elapsed_time = time.time() - start_time
            if elapsed_time >= 0.04:
                start_time = time.time()
                frame_count += 1
                image_bgr = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
                resized_image = cv2.resize(image_bgr, (320, 240))
                file_path = f'./fileRecognition/{user}/{name}/frame_{frame_count}.jpg'
                cv2.imwrite(file_path, resized_image)
                resized_image = model.resize_and_pad(image_bgr, size=(260,260))
                img.append(cv2.cvtColor(resized_image, cv2.COLOR_BGR2GRAY))

        except Exception as e:
            print(f"An error occurred while processing frame: {e}")
            break
    
    print(len(img), img[0].shape)
    img = np.array(img)
    print(img.shape)
    
    
    try:
        model_LBP = model.LSPModel()
        model_LBP.fit(img, np.array([1]*len(img)))
        model_LBP.save(f'./fileRecognition/{user}/{name}/model.h5')
    except Exception as e:
        print(f"An error occurred while making model: {e}")
    
    
    print("Video track processing finished")
    await disconnect_from_server()
    await restart_file()

async def main():
    try:
        await connect_to_server()
        global pc
        pc = RTCPeerConnection()
        pc.on('track', on_track)
        await sio.emit('withoutTrack', {'type': 'withoutTrack', 'token' : token})
        print("RTCPeerConnection created")
        # Esperamos indefinidamente
        while True:
            await asyncio.sleep(1)
    except Exception as e:
        print(f"An error occurred: {e}")
        await restart_file()

# Ejecutamos el bucle de eventos asyncio
asyncio.run(main())
