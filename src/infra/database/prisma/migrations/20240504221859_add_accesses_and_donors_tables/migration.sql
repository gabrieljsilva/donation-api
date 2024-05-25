-- CreateTable
CREATE TABLE "accesses" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "accesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "accessId" INTEGER NOT NULL,

    CONSTRAINT "donors_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "donors" ADD CONSTRAINT "donors_accessId_fkey" FOREIGN KEY ("accessId") REFERENCES "accesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
