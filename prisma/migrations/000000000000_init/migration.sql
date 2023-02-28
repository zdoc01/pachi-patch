-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "oauth_token_secret" TEXT,
    "oauth_token" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameNight" (
    "id" SERIAL NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameNight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameNightId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "gameSessionStatsId" TEXT,
    "isLocked" BOOLEAN,
    "isPlaying" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameSessionStats" (
    "id" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,
    "gameNightId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER,

    CONSTRAINT "GameSessionStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameNightStats" (
    "id" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,
    "gameNightId" INTEGER NOT NULL,
    "wins" INTEGER NOT NULL,
    "losses" INTEGER NOT NULL,
    "score" INTEGER,

    CONSTRAINT "GameNightStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GameToGameNight" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_provider_account_id_key" ON "Account"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_session_token_key" ON "Session"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "GameSession_gameSessionStatsId_key" ON "GameSession"("gameSessionStatsId");

-- CreateIndex
CREATE UNIQUE INDEX "GameSession_userId_gameNightId_key" ON "GameSession"("userId", "gameNightId");

-- CreateIndex
CREATE UNIQUE INDEX "GameSessionStats_gameId_gameNightId_userId_key" ON "GameSessionStats"("gameId", "gameNightId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "GameNightStats_gameNightId_key" ON "GameNightStats"("gameNightId");

-- CreateIndex
CREATE UNIQUE INDEX "GameNightStats_gameId_gameNightId_key" ON "GameNightStats"("gameId", "gameNightId");

-- CreateIndex
CREATE UNIQUE INDEX "_GameToGameNight_AB_unique" ON "_GameToGameNight"("A", "B");

-- CreateIndex
CREATE INDEX "_GameToGameNight_B_index" ON "_GameToGameNight"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameNight" ADD CONSTRAINT "GameNight_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_gameNightId_fkey" FOREIGN KEY ("gameNightId") REFERENCES "GameNight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_gameSessionStatsId_fkey" FOREIGN KEY ("gameSessionStatsId") REFERENCES "GameSessionStats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSessionStats" ADD CONSTRAINT "GameSessionStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSessionStats" ADD CONSTRAINT "GameSessionStats_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSessionStats" ADD CONSTRAINT "GameSessionStats_gameNightId_fkey" FOREIGN KEY ("gameNightId") REFERENCES "GameNight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameNightStats" ADD CONSTRAINT "GameNightStats_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameNightStats" ADD CONSTRAINT "GameNightStats_gameNightId_fkey" FOREIGN KEY ("gameNightId") REFERENCES "GameNight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameToGameNight" ADD CONSTRAINT "_GameToGameNight_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameToGameNight" ADD CONSTRAINT "_GameToGameNight_B_fkey" FOREIGN KEY ("B") REFERENCES "GameNight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

