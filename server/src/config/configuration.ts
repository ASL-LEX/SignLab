/**
 * Holds the configuration information by the server grouped by usage. This
 * file also includes defaults which can be overwritten by environment
 * variables.
 */
export default () => ({
  auth: {
    /** Used for generating the JWT tokens */
    jwtSecret: process.env.JWT_SECRET,
    /** The maximum number of owner accounts supported */
    maxOwnerAccounts: 3,
    /** Password strength requirements */
    passwordComplexity: {
      min: 4,
      max: 36,
      lowerCase: 1,
      upperCase: 0,
      numeric: 0,
      symbol: 0,
      requirementCount: 3
    }
  },
  database: {
    /** The hostname of the database to connect to */
    host: process.env.MONGO_URI
  },
  /** Bucket related settings for storing file objects */
  bucket: {
    /** Identification of which bucket type to be used */
    type: process.env.BUCKET_TYPE,
    /** The name of the bucket */
    name: process.env.BUCKET_NAME,
    /** Using a local folder as a bucket */
    local: {
      folder: process.env.BUCKET_LOCAL_FOLDER
    },
    /** Using S3 complient object storage */
    s3: {
      accessKey: process.env.S3_ACCESS_ID,
      secretKey: process.env.S3_SECRET_ACCESS_KEY,
      baseUrl: process.env.S3_BASE_URL,
      endpoint: process.env.S3_ENDPOINT
    },
    /** Gooogle cloud buckets */
    gcp: {}
  },
  mediaSettings: {
    /** Specifies the supported video types for SignLab */
    supportedVideoTypes: ['webm', 'mp4', 'ogg'],
    /** Specified the supported image types for SignLab */
    supportedImageTypes: ['png', 'jpg', 'jpeg', 'gif']
  }
});
