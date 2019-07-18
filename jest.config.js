module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  setupFiles: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/mock/file.ts',
    '\\.(css|less)$': '<rootDir>/test/mock/style.ts',
  },
  testEnvironment: 'jsdom',
};
