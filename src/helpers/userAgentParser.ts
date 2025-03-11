import DeviceDetector from 'device-detector-js';

const deviceDetector = new DeviceDetector();

export const getDeviceName = (userAgent?: string) => {
  if (!userAgent) return 'unknown_device';

  const { client } = deviceDetector.parse(userAgent);

  if (client?.name) {
    return client?.version
      ? `${client?.name} ${client?.version}`
      : `${client?.name}`;
  }

  return 'unknown_device';
};
