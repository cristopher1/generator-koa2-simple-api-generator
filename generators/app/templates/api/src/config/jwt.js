const { JWT_SECRET, JWT_ALGORITHM } = process.env

export default {
  JWTSecret: JWT_SECRET,
  JWTAlgorithm: JWT_ALGORITHM,
}
