const dev = {
  context: 'http://localhost:9001/'
}

const prod = {
  context: 'http://ec2-54-89-137-191.compute-1.amazonaws.com:3000/'
}

export const environment = process.env.NODE_ENV === 'production'
  ? prod
  : dev
