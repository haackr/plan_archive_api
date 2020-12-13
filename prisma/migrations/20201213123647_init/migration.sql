-- CreateTable
CREATE TABLE [Archive].[ArchAdmin] (
    [useridnum] INT NOT NULL,
    [username] NVARCHAR(1000),
    [password] NVARCHAR(1000),
    CONSTRAINT [PK_ArchAdmin_useridnum] PRIMARY KEY ([useridnum])
);

-- CreateTable
CREATE TABLE [Archive].[MiscSheetsData] (
    [Key] INT NOT NULL,
    [Title] NVARCHAR(1000),
    [Sheet Number] NVARCHAR(1000),
    [Year] NVARCHAR(1000),
    [Month] NVARCHAR(1000),
    [Day] NVARCHAR(1000),
    [LocationNumber] NVARCHAR(1000),
    [FilePathTIFF] NVARCHAR(1000),
    [FilePathPNG] NVARCHAR(1000),
    [FilePathPDF] NVARCHAR(1000),
    [FilePathDWG] NVARCHAR(1000),
    CONSTRAINT [PK_MiscSheetsData_Key] PRIMARY KEY ([Key])
);

-- CreateTable
CREATE TABLE [Archive].[Schools] (
    [SchoolID] NVARCHAR(1000) NOT NULL,
    [SchoolName] NVARCHAR(1000) NOT NULL,
    [ClusterID] NVARCHAR(1000),
    CONSTRAINT [PK_Schools_SchoolID] PRIMARY KEY ([SchoolID])
);

-- CreateTable
CREATE TABLE [Archive].[SetsData] (
    [ID] NVARCHAR(1000) NOT NULL,
    [Year] NVARCHAR(1000),
    [Month] NVARCHAR(1000),
    [Day] NVARCHAR(1000),
    [Title] NVARCHAR(1000),
    [LocationNumber] NVARCHAR(1000),
    [Type] NVARCHAR(1000),
    [Key] INT NOT NULL,
    CONSTRAINT [PK_SetsData_Key] PRIMARY KEY ([Key])
);

-- CreateTable
CREATE TABLE [Archive].[SheetsData] (
    [Title] NVARCHAR(1000),
    [Sheet Number] NVARCHAR(1000),
    [Year] NVARCHAR(1000),
    [Month] NVARCHAR(1000),
    [Day] NVARCHAR(1000),
    [LocationNumber] NVARCHAR(1000),
    [SetID] NVARCHAR(1000),
    [FilePathTIFF] NVARCHAR(1000),
    [FilePathPNG] NVARCHAR(1000),
    [FilePathPDF] NVARCHAR(1000),
    [FilePathDWG] NVARCHAR(1000),
    [Key] INT NOT NULL,
    [SetKey] INT,
    CONSTRAINT [PK_SheetsData_Key] PRIMARY KEY ([Key])
);

-- CreateTable
CREATE TABLE [Archive].[User] (
    [id] NVARCHAR(1000) NOT NULL,
    [username] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [isAdmin] BIT NOT NULL DEFAULT 0,
    CONSTRAINT [PK_User_id] PRIMARY KEY ([id]),
    CONSTRAINT [User_username_unique] UNIQUE ([username])
);

-- AddForeignKey
ALTER TABLE [Archive].[Schools] ADD FOREIGN KEY ([ClusterID]) REFERENCES [Archive].[Schools]([SchoolID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [Archive].[SheetsData] ADD FOREIGN KEY ([SetKey]) REFERENCES [Archive].[SetsData]([Key]) ON DELETE SET NULL ON UPDATE CASCADE;
