USE [ProjectCore]
GO
/****** Object:  Table [dbo].[Content]    Script Date: 8/13/2020 11:40:07 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Content](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[UserId] [nvarchar](32) NOT NULL,
	[Name] [nvarchar](4000) NULL,
	[Summary] [nvarchar](4000) NULL,
	[Description] [nvarchar](max) NULL,
	[DateCreated] [datetime] NULL,
	[IsHidden] [bit] NOT NULL,
	[Link] [nvarchar](255) NULL,
 CONSTRAINT [PK_Content] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ContentByCategory]    Script Date: 8/13/2020 11:40:07 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ContentByCategory](
	[CategoryId] [bigint] NOT NULL,
	[ItemId] [bigint] NOT NULL,
 CONSTRAINT [PK_ContentByCategory] PRIMARY KEY CLUSTERED 
(
	[CategoryId] ASC,
	[ItemId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ContentCategory]    Script Date: 8/13/2020 11:40:07 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ContentCategory](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[ParentId] [bigint] NULL,
	[Left] [bigint] NOT NULL,
	[Right] [bigint] NOT NULL,
	[Level] [int] NOT NULL,
	[OrderNumber] [bigint] NOT NULL,
	[Name] [nvarchar](4000) NULL,
	[IsHidden] [bit] NOT NULL,
	[Summary] [nvarchar](4000) NULL,
	[Description] [nvarchar](max) NULL,
	[Icon] [nvarchar](50) NULL,
 CONSTRAINT [PK_ContentCategory] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[File]    Script Date: 8/13/2020 11:40:07 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[File](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](4000) NULL,
	[DateCreated] [datetime] NULL,
	[UserId] [nvarchar](32) NULL,
	[Title] [nvarchar](4000) NULL,
	[FileExt] [nvarchar](4000) NULL,
	[FileType] [nvarchar](4000) NULL,
	[FileSize] [bigint] NOT NULL,
	[IsVR] [bit] NOT NULL,
	[IsTemp] [bit] NOT NULL,
	[GUID] [nvarchar](4000) NULL,
 CONSTRAINT [PK_File] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FileByCategory]    Script Date: 8/13/2020 11:40:07 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FileByCategory](
	[FileId] [bigint] NOT NULL,
	[CategoryId] [bigint] NOT NULL,
	[ItemId] [nvarchar](32) NOT NULL,
	[ItemField] [nvarchar](400) NOT NULL,
	[OrderNumber] [bigint] NULL,
 CONSTRAINT [PK_FileByCategory] PRIMARY KEY CLUSTERED 
(
	[FileId] ASC,
	[CategoryId] ASC,
	[ItemId] ASC,
	[ItemField] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Product]    Script Date: 8/13/2020 11:40:07 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Product](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[UserId] [nvarchar](32) NOT NULL,
	[BrandId] [bigint] NULL,
	[DateCreated] [datetime] NULL,
	[IsHidden] [bit] NOT NULL,
	[AllowOrder] [bit] NOT NULL,
	[Price] [decimal](18, 0) NULL,
	[PriceSource] [decimal](18, 0) NULL,
	[SaleOffPercent] [decimal](18, 0) NULL,
	[Name] [nvarchar](max) NULL,
	[Summary] [nvarchar](4000) NULL,
	[Description] [nvarchar](max) NULL,
	[Quantity] [bigint] NULL,
 CONSTRAINT [PK_Product] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductBrand]    Script Date: 8/13/2020 11:40:07 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductBrand](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](4000) NULL,
	[PopularOrderNumber] [bigint] NULL,
 CONSTRAINT [PK_ProductBrand] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductByCategory]    Script Date: 8/13/2020 11:40:07 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductByCategory](
	[CategoryId] [bigint] NOT NULL,
	[ItemId] [bigint] NOT NULL,
 CONSTRAINT [PK_ProductByCategory] PRIMARY KEY CLUSTERED 
(
	[CategoryId] ASC,
	[ItemId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductCategory]    Script Date: 8/13/2020 11:40:07 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductCategory](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[ParentId] [bigint] NULL,
	[Name] [nvarchar](4000) NULL,
	[Left] [bigint] NOT NULL,
	[Right] [bigint] NOT NULL,
	[Level] [int] NOT NULL,
	[OrderNumber] [bigint] NOT NULL,
	[IsHidden] [bit] NOT NULL,
	[PopularOrderNumber] [bigint] NULL,
	[Icon] [nvarchar](50) NULL,
 CONSTRAINT [PK_ProductCategory] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Role]    Script Date: 8/13/2020 11:40:07 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Role](
	[Id] [nvarchar](32) NOT NULL,
	[Name] [nvarchar](255) NULL,
 CONSTRAINT [PK_Role] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User]    Script Date: 8/13/2020 11:40:07 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[Id] [nvarchar](32) NOT NULL,
	[UserName] [nvarchar](255) NULL,
	[Email] [nvarchar](255) NULL,
	[PasswordHash] [nvarchar](255) NULL,
	[FullName] [nvarchar](255) NULL,
	[PhoneNumber] [nvarchar](255) NULL,
	[IsActivated] [bit] NOT NULL,
	[IsBanned] [bit] NOT NULL,
	[DateCreated] [datetime] NULL,
	[DateLogout] [datetime] NULL,
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserByRole]    Script Date: 8/13/2020 11:40:07 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserByRole](
	[RoleId] [nvarchar](32) NOT NULL,
	[UserId] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK_UserByRole] PRIMARY KEY CLUSTERED 
(
	[RoleId] ASC,
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Content] ON 

INSERT [dbo].[Content] ([Id], [UserId], [Name], [Summary], [Description], [DateCreated], [IsHidden], [Link]) VALUES (1, N'eeab39b2134949a4a8da9a86e71c9a2a', N'Về chúng tôi', NULL, N'<p>Th&ocirc;ng tin đang cập nhật</p>', CAST(N'2020-08-13T19:29:41.043' AS DateTime), 0, NULL)
SET IDENTITY_INSERT [dbo].[Content] OFF
INSERT [dbo].[ContentByCategory] ([CategoryId], [ItemId]) VALUES (5, 1)
SET IDENTITY_INSERT [dbo].[ContentCategory] ON 

INSERT [dbo].[ContentCategory] ([Id], [ParentId], [Left], [Right], [Level], [OrderNumber], [Name], [IsHidden], [Summary], [Description], [Icon]) VALUES (1, 0, 1, 6, 0, 0, N'Category', 0, NULL, NULL, NULL)
INSERT [dbo].[ContentCategory] ([Id], [ParentId], [Left], [Right], [Level], [OrderNumber], [Name], [IsHidden], [Summary], [Description], [Icon]) VALUES (4, 1, 2, 5, 1, 0, N'Mai Hậu', 0, N'Website Mai Hậu', N'', NULL)
INSERT [dbo].[ContentCategory] ([Id], [ParentId], [Left], [Right], [Level], [OrderNumber], [Name], [IsHidden], [Summary], [Description], [Icon]) VALUES (5, 4, 3, 4, 2, 0, N'Giới thiệu', 0, N'Menu chính', N'', N'<i class="far fa-building"></i>')
SET IDENTITY_INSERT [dbo].[ContentCategory] OFF
SET IDENTITY_INSERT [dbo].[File] ON 

INSERT [dbo].[File] ([Id], [Name], [DateCreated], [UserId], [Title], [FileExt], [FileType], [FileSize], [IsVR], [IsTemp], [GUID]) VALUES (1, N'2092679d-3ece-4bd5-8311-87e560e6d3cd.png', NULL, N'eeab39b2134949a4a8da9a86e71c9a2a', N'toshiba', N'.png', N'image/png', 10891, 0, 0, NULL)
INSERT [dbo].[File] ([Id], [Name], [DateCreated], [UserId], [Title], [FileExt], [FileType], [FileSize], [IsVR], [IsTemp], [GUID]) VALUES (2, N'2504b6d9-75a4-4b36-80cf-88320a5ab259.jpg', NULL, N'eeab39b2134949a4a8da9a86e71c9a2a', N'may-pha-ca-phe-delonghi-la-specialista-ec9335-m', N'.jpg', N'image/jpeg', 51774, 0, 0, NULL)
INSERT [dbo].[File] ([Id], [Name], [DateCreated], [UserId], [Title], [FileExt], [FileType], [FileSize], [IsVR], [IsTemp], [GUID]) VALUES (3, N'6573ef85-33e5-407c-b41f-4c7fe7684720.jpg', NULL, N'eeab39b2134949a4a8da9a86e71c9a2a', N'may-pha-ca-phe-delonghi-la-specialista-ec9335-VOI', N'.jpg', N'image/jpeg', 135105, 0, 0, NULL)
INSERT [dbo].[File] ([Id], [Name], [DateCreated], [UserId], [Title], [FileExt], [FileType], [FileSize], [IsVR], [IsTemp], [GUID]) VALUES (4, N'adb64c36-683b-45b0-8ee6-162d8080c3fa.jpg', NULL, N'eeab39b2134949a4a8da9a86e71c9a2a', N'may-pha-ca-phe-delonghi-la-specialista-ec9335-VOI', N'.jpg', N'image/jpeg', 135105, 0, 0, NULL)
INSERT [dbo].[File] ([Id], [Name], [DateCreated], [UserId], [Title], [FileExt], [FileType], [FileSize], [IsVR], [IsTemp], [GUID]) VALUES (5, N'bd861592-faea-45e7-9213-9c2557c15763.jpg', NULL, N'eeab39b2134949a4a8da9a86e71c9a2a', N'may-pha-ca-phe-delonghi-la-specialista-ec9335-m', N'.jpg', N'image/jpeg', 51774, 0, 0, NULL)
INSERT [dbo].[File] ([Id], [Name], [DateCreated], [UserId], [Title], [FileExt], [FileType], [FileSize], [IsVR], [IsTemp], [GUID]) VALUES (6, N'5bb187ff-f5bc-4431-ab31-55f3b1a2ef3f.jpg', NULL, N'eeab39b2134949a4a8da9a86e71c9a2a', N'may-pha-ca-phe-delonghi-la-specialista-ec9335-VOI', N'.jpg', N'image/jpeg', 135105, 0, 0, NULL)
INSERT [dbo].[File] ([Id], [Name], [DateCreated], [UserId], [Title], [FileExt], [FileType], [FileSize], [IsVR], [IsTemp], [GUID]) VALUES (7, N'b9cb8c0f-9f66-4caa-b1b5-799ed7fd0625.jpg', NULL, N'eeab39b2134949a4a8da9a86e71c9a2a', N'may-pha-ca-phe-delonghi-la-specialista-ec9335-sd', N'.jpg', N'image/jpeg', 105656, 0, 0, NULL)
INSERT [dbo].[File] ([Id], [Name], [DateCreated], [UserId], [Title], [FileExt], [FileType], [FileSize], [IsVR], [IsTemp], [GUID]) VALUES (8, N'575674ff-9ba6-45d1-9d76-b8833de17f02.png', NULL, N'eeab39b2134949a4a8da9a86e71c9a2a', N'Circle-icons-motorcycle.svg', N'.png', N'image/png', 77552, 0, 0, NULL)
INSERT [dbo].[File] ([Id], [Name], [DateCreated], [UserId], [Title], [FileExt], [FileType], [FileSize], [IsVR], [IsTemp], [GUID]) VALUES (9, N'51e358b4-e98c-4703-bf3c-f0fb4b38d674.jpg', NULL, N'eeab39b2134949a4a8da9a86e71c9a2a', N'Berjaya-Logo-compress', N'.jpg', N'image/jpeg', 52946, 0, 0, NULL)
INSERT [dbo].[File] ([Id], [Name], [DateCreated], [UserId], [Title], [FileExt], [FileType], [FileSize], [IsVR], [IsTemp], [GUID]) VALUES (10, N'f22dbeb0-92e2-4878-aed8-2513dcd7b62a.png', NULL, N'eeab39b2134949a4a8da9a86e71c9a2a', N'toshiba', N'.png', N'image/png', 10891, 0, 0, NULL)
INSERT [dbo].[File] ([Id], [Name], [DateCreated], [UserId], [Title], [FileExt], [FileType], [FileSize], [IsVR], [IsTemp], [GUID]) VALUES (11, N'cc48872e-7266-4eb0-b9c0-30d9a64e49c5.jpg', NULL, N'eeab39b2134949a4a8da9a86e71c9a2a', N'images', N'.jpg', N'image/jpeg', 9929, 0, 0, NULL)
SET IDENTITY_INSERT [dbo].[File] OFF
INSERT [dbo].[FileByCategory] ([FileId], [CategoryId], [ItemId], [ItemField], [OrderNumber]) VALUES (1, 7, N'1', N'image', 0)
INSERT [dbo].[FileByCategory] ([FileId], [CategoryId], [ItemId], [ItemField], [OrderNumber]) VALUES (2, 3, N'0', N'image', 0)
INSERT [dbo].[FileByCategory] ([FileId], [CategoryId], [ItemId], [ItemField], [OrderNumber]) VALUES (3, 3, N'0', N'image', 1)
INSERT [dbo].[FileByCategory] ([FileId], [CategoryId], [ItemId], [ItemField], [OrderNumber]) VALUES (4, 3, N'0', N'description', 0)
INSERT [dbo].[FileByCategory] ([FileId], [CategoryId], [ItemId], [ItemField], [OrderNumber]) VALUES (5, 3, N'1', N'image', 0)
INSERT [dbo].[FileByCategory] ([FileId], [CategoryId], [ItemId], [ItemField], [OrderNumber]) VALUES (6, 3, N'1', N'image', 1)
INSERT [dbo].[FileByCategory] ([FileId], [CategoryId], [ItemId], [ItemField], [OrderNumber]) VALUES (7, 3, N'1', N'description', 0)
INSERT [dbo].[FileByCategory] ([FileId], [CategoryId], [ItemId], [ItemField], [OrderNumber]) VALUES (8, 1, N'eeab39b2134949a4a8da9a86e71c9a2a', N'image', 0)
INSERT [dbo].[FileByCategory] ([FileId], [CategoryId], [ItemId], [ItemField], [OrderNumber]) VALUES (9, 7, N'4', N'image', 0)
INSERT [dbo].[FileByCategory] ([FileId], [CategoryId], [ItemId], [ItemField], [OrderNumber]) VALUES (10, 7, N'2', N'image', 0)
INSERT [dbo].[FileByCategory] ([FileId], [CategoryId], [ItemId], [ItemField], [OrderNumber]) VALUES (11, 7, N'3', N'image', 0)
SET IDENTITY_INSERT [dbo].[Product] ON 

INSERT [dbo].[Product] ([Id], [UserId], [BrandId], [DateCreated], [IsHidden], [AllowOrder], [Price], [PriceSource], [SaleOffPercent], [Name], [Summary], [Description], [Quantity]) VALUES (1, N'eeab39b2134949a4a8da9a86e71c9a2a', 3, CAST(N'2020-08-13T21:17:44.460' AS DateTime), 0, 1, CAST(23900000 AS Decimal(18, 0)), CAST(33400000 AS Decimal(18, 0)), CAST(28 AS Decimal(18, 0)), N'Máy pha cà phê Delonghi La Specialista EC9335.M', N'Hàng bảo hành chính hãng
Sản phẩm tiện dùng
Cafe thơm ngon
', N'<h2>M&aacute;y pha c&agrave; ph&ecirc; DeLonghi La Specialista EC9335.M mang đến bề mặt sữa mượt m&agrave;, ngon miệng</h2>
<p>M&aacute;y pha c&agrave; ph&ecirc; l&agrave; vật dụng rất tiện lợi tại c&aacute;c trường học, doanh nghiệp, nh&agrave; h&agrave;ng, kh&aacute;ch sạn... M&aacute;y pha c&agrave; ph&ecirc; La Specialista EC9335.M l&agrave; chiếc m&aacute;y mang đến thời gian pha rất nhanh c&ugrave;ng bề mặt sữa rất mượt m&agrave;, sẽ l&agrave; sản phẩm v&ocirc; c&ugrave;ng hữu &iacute;ch cho bữa s&aacute;ng đầy năng lượng.<img src="https://localhost:5001/api/image/7/1024" alt="" width="600" height="600" /></p>
<p>Chiếc m&aacute;y pha c&agrave; ph&ecirc; tự động n&agrave;y sử dụng c&ocirc;ng nghệ xay cảm biến gi&uacute;p cho c&agrave; ph&ecirc; hạt được xay đều v&agrave; đồng nhất, v&igrave; thế những t&aacute;ch cafe lu&ocirc;n mịn v&agrave; dễ uống. Đặc biệt, thanh n&eacute;n t&iacute;ch hợp sẵn trong m&aacute;y sẽ đảm bảo lực n&eacute;n l&yacute; tưởng, cho ra những ly cafe đồng đều.</p>
<p class="_ilcss8_">Đồng thời, m&aacute;y c&oacute; trang bị bộ điều khiển nhiệt độ rất ổn định, gi&uacute;p người d&ugrave;ng dễ d&agrave;ng thao t&aacute;c hơn. M&aacute;y pha c&agrave; ph&ecirc;&nbsp;sẽ hoạt động hiệu quả trong gi&acirc;y l&aacute;t nhờ v&agrave;o 3 c&ocirc;ng thức c&agrave;i đặt sẵn.</p>
<h3><strong>Những t&iacute;nh năng vượt trội kh&aacute;c</strong></h3>
<ul>
<li>Sau khi xay, m&aacute;y sẽ n&eacute;n trực tiếp v&agrave;o gi&aacute; đỡ bộ lọc bằng c&aacute;ch đẩy cần gạt xuống. Thanh n&eacute;n sẽ dừng lại khi c&agrave; ph&ecirc; đạt được &aacute;p suất ch&iacute;nh x&aacute;c.</li>
<li>Nhiệt độ nước trong m&aacute;y lu&ocirc;n được giữ ổn định trong suốt qu&aacute; tr&igrave;nh ủ, cho c&ocirc;ng đoạn chiết xuất c&agrave; ph&ecirc; tốt nhất.</li>
<li>Hai hệ thống đun n&oacute;ng độc lập đảm bảo kh&ocirc;ng phải chờ đợi khi pha chế c&agrave; ph&ecirc; v&agrave; chuẩn bị sữa.</li>
<li>Bạn chỉ cần chọn FLAT cho sữa n&oacute;ng hoặc FOAM để tạo bọt sữa tr&ecirc;n bộ chọn v&ograve;i hơi, đặt b&igrave;nh v&agrave;o v&agrave; đợi cho đến khi đạt được kết quả mong muốn.</li>
</ul>', 10)
SET IDENTITY_INSERT [dbo].[Product] OFF
SET IDENTITY_INSERT [dbo].[ProductBrand] ON 

INSERT [dbo].[ProductBrand] ([Id], [Name], [PopularOrderNumber]) VALUES (2, N'Toshiba', 1)
INSERT [dbo].[ProductBrand] ([Id], [Name], [PopularOrderNumber]) VALUES (3, N'Delonghi', 2)
INSERT [dbo].[ProductBrand] ([Id], [Name], [PopularOrderNumber]) VALUES (4, N'Berjaya', 3)
SET IDENTITY_INSERT [dbo].[ProductBrand] OFF
INSERT [dbo].[ProductByCategory] ([CategoryId], [ItemId]) VALUES (12, 1)
SET IDENTITY_INSERT [dbo].[ProductCategory] ON 

INSERT [dbo].[ProductCategory] ([Id], [ParentId], [Name], [Left], [Right], [Level], [OrderNumber], [IsHidden], [PopularOrderNumber], [Icon]) VALUES (1, 0, N'Category', 1, 30, 0, 0, 0, NULL, NULL)
INSERT [dbo].[ProductCategory] ([Id], [ParentId], [Name], [Left], [Right], [Level], [OrderNumber], [IsHidden], [PopularOrderNumber], [Icon]) VALUES (12, 1, N'Máy pha cà phê', 2, 7, 1, 0, 0, 2, N'<i class="fas fa-mug-hot"></i>')
INSERT [dbo].[ProductCategory] ([Id], [ParentId], [Name], [Left], [Right], [Level], [OrderNumber], [IsHidden], [PopularOrderNumber], [Icon]) VALUES (13, 1, N'Lò nướng', 8, 13, 1, 1, 0, 3, N'<i class="fas fa-microwave"></i>')
INSERT [dbo].[ProductCategory] ([Id], [ParentId], [Name], [Left], [Right], [Level], [OrderNumber], [IsHidden], [PopularOrderNumber], [Icon]) VALUES (14, 13, N'Lò nướng đối lưu', 9, 10, 2, 0, 0, NULL, NULL)
INSERT [dbo].[ProductCategory] ([Id], [ParentId], [Name], [Left], [Right], [Level], [OrderNumber], [IsHidden], [PopularOrderNumber], [Icon]) VALUES (15, 13, N'Lò nướng nằm ngang', 11, 12, 2, 1, 0, NULL, NULL)
INSERT [dbo].[ProductCategory] ([Id], [ParentId], [Name], [Left], [Right], [Level], [OrderNumber], [IsHidden], [PopularOrderNumber], [Icon]) VALUES (16, 1, N'Máy trộn bột', 14, 19, 1, 2, 0, 1, N'<i class="fas fa-blender-phone"></i>')
INSERT [dbo].[ProductCategory] ([Id], [ParentId], [Name], [Left], [Right], [Level], [OrderNumber], [IsHidden], [PopularOrderNumber], [Icon]) VALUES (17, 16, N'Máy trộn bột đầu nghiêng', 15, 16, 2, 0, 0, NULL, NULL)
INSERT [dbo].[ProductCategory] ([Id], [ParentId], [Name], [Left], [Right], [Level], [OrderNumber], [IsHidden], [PopularOrderNumber], [Icon]) VALUES (18, 16, N'Máy trộn bột công nghiệp', 17, 18, 2, 1, 0, NULL, NULL)
INSERT [dbo].[ProductCategory] ([Id], [ParentId], [Name], [Left], [Right], [Level], [OrderNumber], [IsHidden], [PopularOrderNumber], [Icon]) VALUES (19, 1, N'Máy ép / máy xay trái cây', 20, 29, 1, 3, 0, NULL, NULL)
INSERT [dbo].[ProductCategory] ([Id], [ParentId], [Name], [Left], [Right], [Level], [OrderNumber], [IsHidden], [PopularOrderNumber], [Icon]) VALUES (20, 19, N'Máy ép trái cây', 21, 22, 2, 0, 0, NULL, NULL)
INSERT [dbo].[ProductCategory] ([Id], [ParentId], [Name], [Left], [Right], [Level], [OrderNumber], [IsHidden], [PopularOrderNumber], [Icon]) VALUES (21, 19, N'Máy xay sinh tố', 23, 28, 2, 1, 0, NULL, NULL)
INSERT [dbo].[ProductCategory] ([Id], [ParentId], [Name], [Left], [Right], [Level], [OrderNumber], [IsHidden], [PopularOrderNumber], [Icon]) VALUES (22, 21, N'Máy xay sinh tố công nghiệp', 24, 25, 3, 0, 0, NULL, NULL)
INSERT [dbo].[ProductCategory] ([Id], [ParentId], [Name], [Left], [Right], [Level], [OrderNumber], [IsHidden], [PopularOrderNumber], [Icon]) VALUES (23, 21, N'Máy xay sinh tố gia đình', 26, 27, 3, 1, 0, NULL, NULL)
INSERT [dbo].[ProductCategory] ([Id], [ParentId], [Name], [Left], [Right], [Level], [OrderNumber], [IsHidden], [PopularOrderNumber], [Icon]) VALUES (24, 12, N'Máy pha cà phê gia đình', 3, 4, 2, 0, 0, NULL, NULL)
INSERT [dbo].[ProductCategory] ([Id], [ParentId], [Name], [Left], [Right], [Level], [OrderNumber], [IsHidden], [PopularOrderNumber], [Icon]) VALUES (25, 12, N'Máy pha cà phê cho quán', 5, 6, 2, 1, 0, NULL, NULL)
SET IDENTITY_INSERT [dbo].[ProductCategory] OFF
INSERT [dbo].[Role] ([Id], [Name]) VALUES (N'admin', N'Administrator')
INSERT [dbo].[Role] ([Id], [Name]) VALUES (N'contentmanager', N'Content Manager')
INSERT [dbo].[Role] ([Id], [Name]) VALUES (N'productmanager', N'Product Manager')
INSERT [dbo].[Role] ([Id], [Name]) VALUES (N'user', N'user')
INSERT [dbo].[User] ([Id], [UserName], [Email], [PasswordHash], [FullName], [PhoneNumber], [IsActivated], [IsBanned], [DateCreated], [DateLogout]) VALUES (N'eeab39b2134949a4a8da9a86e71c9a2a', N'admin', N'vnanhtuan@gmail.com', N'15b1650efe578dd8f385c52d7db91ad016083bd1eaa394de681ac5456ef54ef6', N'Administrator', NULL, 1, 0, CAST(N'2020-08-04T18:23:55.640' AS DateTime), CAST(N'2020-08-13T21:21:20.220' AS DateTime))
INSERT [dbo].[UserByRole] ([RoleId], [UserId]) VALUES (N'admin', N'eeab39b2134949a4a8da9a86e71c9a2a')
ALTER TABLE [dbo].[ContentByCategory]  WITH CHECK ADD  CONSTRAINT [FK_ContentByCategory_Content] FOREIGN KEY([ItemId])
REFERENCES [dbo].[Content] ([Id])
GO
ALTER TABLE [dbo].[ContentByCategory] CHECK CONSTRAINT [FK_ContentByCategory_Content]
GO
ALTER TABLE [dbo].[ContentByCategory]  WITH CHECK ADD  CONSTRAINT [FK_ContentByCategory_ContentCategory] FOREIGN KEY([CategoryId])
REFERENCES [dbo].[ContentCategory] ([Id])
GO
ALTER TABLE [dbo].[ContentByCategory] CHECK CONSTRAINT [FK_ContentByCategory_ContentCategory]
GO
ALTER TABLE [dbo].[File]  WITH CHECK ADD  CONSTRAINT [FK_File_User] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[File] CHECK CONSTRAINT [FK_File_User]
GO
ALTER TABLE [dbo].[FileByCategory]  WITH CHECK ADD  CONSTRAINT [FK_FileByCategory_File] FOREIGN KEY([FileId])
REFERENCES [dbo].[File] ([Id])
GO
ALTER TABLE [dbo].[FileByCategory] CHECK CONSTRAINT [FK_FileByCategory_File]
GO
ALTER TABLE [dbo].[Product]  WITH CHECK ADD  CONSTRAINT [FK_Product_ProductBrand] FOREIGN KEY([BrandId])
REFERENCES [dbo].[ProductBrand] ([Id])
GO
ALTER TABLE [dbo].[Product] CHECK CONSTRAINT [FK_Product_ProductBrand]
GO
ALTER TABLE [dbo].[Product]  WITH CHECK ADD  CONSTRAINT [FK_Product_User] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[Product] CHECK CONSTRAINT [FK_Product_User]
GO
ALTER TABLE [dbo].[ProductByCategory]  WITH CHECK ADD  CONSTRAINT [FK_ProductByCategory_Product] FOREIGN KEY([ItemId])
REFERENCES [dbo].[Product] ([Id])
GO
ALTER TABLE [dbo].[ProductByCategory] CHECK CONSTRAINT [FK_ProductByCategory_Product]
GO
ALTER TABLE [dbo].[ProductByCategory]  WITH CHECK ADD  CONSTRAINT [FK_ProductByCategory_ProductCategory] FOREIGN KEY([CategoryId])
REFERENCES [dbo].[ProductCategory] ([Id])
GO
ALTER TABLE [dbo].[ProductByCategory] CHECK CONSTRAINT [FK_ProductByCategory_ProductCategory]
GO
ALTER TABLE [dbo].[UserByRole]  WITH CHECK ADD  CONSTRAINT [FK_UserByRole_Role] FOREIGN KEY([RoleId])
REFERENCES [dbo].[Role] ([Id])
GO
ALTER TABLE [dbo].[UserByRole] CHECK CONSTRAINT [FK_UserByRole_Role]
GO
ALTER TABLE [dbo].[UserByRole]  WITH CHECK ADD  CONSTRAINT [FK_UserByRole_User] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[UserByRole] CHECK CONSTRAINT [FK_UserByRole_User]
GO
