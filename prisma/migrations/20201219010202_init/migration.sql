-- CreateTable
CREATE TABLE [Archive].[ArchAdmin] (
    [useridnum] INT NOT NULL,
    [username] NVARCHAR(1000),
    [password] NVARCHAR(1000),
    CONSTRAINT [PK__ArchAdmin__useridnum] PRIMARY KEY ([useridnum])
);

-- CreateTable
CREATE TABLE [Archive].[MiscSheetsData] (
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
    [id] INT IDENTITY(1,1),
    [school_id] INT,
    CONSTRAINT [PK__MiscSheetsData__id] PRIMARY KEY ([id])
);

-- CreateTable
CREATE TABLE [Archive].[Schools] (
    [SchoolID] NVARCHAR(1000) NOT NULL,
    [SchoolName] NVARCHAR(1000) NOT NULL,
    [ClusterID] NVARCHAR(1000),
    [id] INT IDENTITY(1,1),
    CONSTRAINT [PK__Schools__id] PRIMARY KEY ([id]),
    CONSTRAINT [Schools_SchoolID_unique] UNIQUE ([SchoolID])
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
    [Key] INT IDENTITY(1,1),
    [school_id] INT,
    CONSTRAINT [PK__SetsData__Key] PRIMARY KEY ([Key])
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
    [set_id] INT,
    [id] INT IDENTITY(1,1),
    [school_id] INT,
    CONSTRAINT [PK__SheetsData__id] PRIMARY KEY ([id])
);

-- CreateTable
CREATE TABLE [Archive].[User] (
    [id] NVARCHAR(1000) NOT NULL,
    [username] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [isAdmin] BIT NOT NULL CONSTRAINT [DF__User__isAdmin] DEFAULT 0,
    [confirmed] BIT NOT NULL CONSTRAINT [DF__User__confirmed] DEFAULT 0,
    CONSTRAINT [PK__User__id] PRIMARY KEY ([id]),
    CONSTRAINT [User_username_unique] UNIQUE ([username])
);

-- AddForeignKey
ALTER TABLE [Archive].[MiscSheetsData] ADD CONSTRAINT [FK__MiscSheetsData__school_id] FOREIGN KEY ([school_id]) REFERENCES [Archive].[Schools]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [Archive].[Schools] ADD CONSTRAINT [FK__Schools__ClusterID] FOREIGN KEY ([ClusterID]) REFERENCES [Archive].[Schools]([SchoolID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [Archive].[SetsData] ADD CONSTRAINT [FK__SetsData__school_id] FOREIGN KEY ([school_id]) REFERENCES [Archive].[Schools]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [Archive].[SheetsData] ADD CONSTRAINT [FK__SheetsData__school_id] FOREIGN KEY ([school_id]) REFERENCES [Archive].[Schools]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [Archive].[SheetsData] ADD CONSTRAINT [FK__SheetsData__set_id] FOREIGN KEY ([set_id]) REFERENCES [Archive].[SetsData]([Key]) ON DELETE NO ACTION ON UPDATE NO ACTION;
