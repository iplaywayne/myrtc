Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
  set: () => { },
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

global.RTCPeerConnection = () => {
  return {
    close: () => { },
    getTracks: () => { },
    addStream: () => { },
    createOffer: () => { },
    addIceCandidate: () => { },
    setRemoteDescription: () => { },
    createAnswer: () => { },
    setLocalDescription: () => { },
    addTransceiver: () => { },
  };
};