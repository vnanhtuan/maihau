using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ProjectCore.Models
{
    public partial class ProjectDbContext : DbContext
    {
        public ProjectDbContext()
        {
        }

        public ProjectDbContext(DbContextOptions<ProjectDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Content> Content { get; set; }
        public virtual DbSet<ContentByCategory> ContentByCategory { get; set; }
        public virtual DbSet<ContentCategory> ContentCategory { get; set; }
        public virtual DbSet<File> File { get; set; }
        public virtual DbSet<FileByCategory> FileByCategory { get; set; }
        public virtual DbSet<Product> Product { get; set; }
        public virtual DbSet<ProductBrand> ProductBrand { get; set; }
        public virtual DbSet<ProductByCategory> ProductByCategory { get; set; }
        public virtual DbSet<ProductCategory> ProductCategory { get; set; }
        public virtual DbSet<Role> Role { get; set; }
        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<UserByRole> UserByRole { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=localhost;Database=ProjectCore;user id=sa;password=123456;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Content>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.Link).HasMaxLength(255);

                entity.Property(e => e.Name).HasMaxLength(4000);

                entity.Property(e => e.Summary).HasMaxLength(4000);

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(32);
            });

            modelBuilder.Entity<ContentByCategory>(entity =>
            {
                entity.HasKey(e => new { e.CategoryId, e.ItemId });

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.ContentByCategory)
                    .HasForeignKey(d => d.CategoryId)
                    .HasConstraintName("FK_ContentByCategory_ContentCategory");

                entity.HasOne(d => d.Item)
                    .WithMany(p => p.ContentByCategory)
                    .HasForeignKey(d => d.ItemId)
                    .HasConstraintName("FK_ContentByCategory_Content");
            });

            modelBuilder.Entity<ContentCategory>(entity =>
            {
                entity.Property(e => e.Icon).HasMaxLength(50);

                entity.Property(e => e.Name).HasMaxLength(4000);

                entity.Property(e => e.Summary).HasMaxLength(4000);
            });

            modelBuilder.Entity<File>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.FileExt).HasMaxLength(4000);

                entity.Property(e => e.FileType).HasMaxLength(4000);

                entity.Property(e => e.GUID).HasMaxLength(4000);

                entity.Property(e => e.Name).HasMaxLength(4000);

                entity.Property(e => e.Title).HasMaxLength(4000);

                entity.Property(e => e.UserId).HasMaxLength(32);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.File)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_File_User");
            });

            modelBuilder.Entity<FileByCategory>(entity =>
            {
                entity.HasKey(e => new { e.FileId, e.CategoryId, e.ItemId, e.ItemField });

                entity.Property(e => e.ItemId).HasMaxLength(32);

                entity.Property(e => e.ItemField).HasMaxLength(400);

                entity.HasOne(d => d.File)
                    .WithMany(p => p.FileByCategory)
                    .HasForeignKey(d => d.FileId)
                    .HasConstraintName("FK_FileByCategory_File");
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.Price).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.PriceSource).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.SaleOffPercent).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.Summary).HasMaxLength(4000);

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(32);

                entity.HasOne(d => d.Brand)
                    .WithMany(p => p.Product)
                    .HasForeignKey(d => d.BrandId)
                    .HasConstraintName("FK_Product_ProductBrand");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Product)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Product_User");
            });

            modelBuilder.Entity<ProductBrand>(entity =>
            {
                entity.Property(e => e.Name).HasMaxLength(4000);
            });

            modelBuilder.Entity<ProductByCategory>(entity =>
            {
                entity.HasKey(e => new { e.CategoryId, e.ItemId });

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.ProductByCategory)
                    .HasForeignKey(d => d.CategoryId)
                    .HasConstraintName("FK_ProductByCategory_ProductCategory");

                entity.HasOne(d => d.Item)
                    .WithMany(p => p.ProductByCategory)
                    .HasForeignKey(d => d.ItemId)
                    .HasConstraintName("FK_ProductByCategory_Product");
            });

            modelBuilder.Entity<ProductCategory>(entity =>
            {
                entity.Property(e => e.Icon).HasMaxLength(50);

                entity.Property(e => e.Name).HasMaxLength(4000);
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.Property(e => e.Id).HasMaxLength(32);

                entity.Property(e => e.Name).HasMaxLength(255);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.Id).HasMaxLength(32);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateLogout).HasColumnType("datetime");

                entity.Property(e => e.Email).HasMaxLength(255);

                entity.Property(e => e.FullName).HasMaxLength(255);

                entity.Property(e => e.PasswordHash).HasMaxLength(255);

                entity.Property(e => e.PhoneNumber).HasMaxLength(255);

                entity.Property(e => e.UserName).HasMaxLength(255);
            });

            modelBuilder.Entity<UserByRole>(entity =>
            {
                entity.HasKey(e => new { e.RoleId, e.UserId });

                entity.Property(e => e.RoleId).HasMaxLength(32);

                entity.Property(e => e.UserId).HasMaxLength(32);

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.UserByRole)
                    .HasForeignKey(d => d.RoleId)
                    .HasConstraintName("FK_UserByRole_Role");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserByRole)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_UserByRole_User");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
