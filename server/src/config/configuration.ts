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
  },
  database: {
    /** The hostname of the database to connect to */
    host: process.env.MONGO_URI,
  },
  /** Bucket related settings for storing file objects */
  bucket: {
    /** Identification of which bucket type to be used */
    type: process.env.BUCKET_TYPE,
    /** The name of the bucket */
    name: process.env.BUCKET_NAME,
    /** Using a local folder as a bucket */
    local: {
      folder: process.env.BUCKET_LOCAL_FOLDER,
    },
    /** Using S3 complient object storage */
    s3: {
      accessKey: process.env.S3_ACCESS_ID,
      secretKey: process.env.S3_SECRET_ACCESS_KEY,
      baseUrl: process.env.S3_BASE_URL,
      endpoint: process.env.S3_ENDPOINT,
    },
    /** Gooogle cloud buckets */
    gcp: {},
  },
  videoSettings: {
    /** Specifies the types that users can upload to SignLab */
    supportedTypes: ['webm', 'mp4', 'ogg'],
  },
});
