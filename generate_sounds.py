import struct
import math

def create_wav(filename, frequency=800, duration=0.2, volume=0.3):
    """Create a simple WAV file with a sine wave tone"""
    sample_rate = 44100
    num_samples = int(sample_rate * duration)
    
    # Create WAV header
    byte_rate = sample_rate * 2
    
    wav_header = b'RIFF'
    wav_header += struct.pack('<I', 36 + num_samples * 2)
    wav_header += b'WAVE'
    wav_header += b'fmt '
    wav_header += struct.pack('<I', 16)  # subchunk1size
    wav_header += struct.pack('<H', 1)   # audio format (PCM)
    wav_header += struct.pack('<H', 1)   # num channels
    wav_header += struct.pack('<I', sample_rate)
    wav_header += struct.pack('<I', byte_rate)
    wav_header += struct.pack('<H', 2)   # block align
    wav_header += struct.pack('<H', 16)  # bits per sample
    
    wav_header += b'data'
    wav_header += struct.pack('<I', num_samples * 2)
    
    # Generate audio data
    audio_data = b''
    for i in range(num_samples):
        sample = math.sin(2 * math.pi * frequency * i / sample_rate) * volume
        sample = int(sample * 32767)
        audio_data += struct.pack('<h', sample)
    
    with open(filename, 'wb') as f:
        f.write(wav_header + audio_data)

# Create different tones for each sound
create_wav('assets/sounds/classic-tick.wav', frequency=800, duration=0.15, volume=0.3)
create_wav('assets/sounds/wood-knock.wav', frequency=600, duration=0.20, volume=0.3)
create_wav('assets/sounds/digital-beep.wav', frequency=1000, duration=0.10, volume=0.25)
create_wav('assets/sounds/soft-bell.wav', frequency=1200, duration=0.30, volume=0.2)

print('Created audio WAV files')
