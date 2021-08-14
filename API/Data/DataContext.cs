using System;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace API.Data
{
    public class DataContext : IdentityDbContext<AppUser, AppRole, int, IdentityUserClaim<int>,
     AppUserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AppUser>()
                                .HasMany(u => u.UserRole)
                                .WithOne(u => u.User)
                                .HasForeignKey(u => u.UserId)
                                .IsRequired();

            modelBuilder.Entity<AppRole>()
                                .HasMany(u => u.UserRole)
                                .WithOne(u => u.Role)
                                .HasForeignKey(u => u.RoleId)
                                .IsRequired();


            modelBuilder.Entity<UserLike>()
                                .HasKey(u => new { u.SourceUserId, u.LikedUserId });

            modelBuilder.Entity<UserLike>()
                                .HasOne(s => s.SourceUser)
                                .WithMany(l => l.LikedUsers)
                                .HasForeignKey(s => s.SourceUserId)
                                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserLike>()
                                .HasOne(s => s.LikedUser)
                                .WithMany(l => l.LikedByUsers)
                                .HasForeignKey(s => s.LikedUserId)
                                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<Message>()
                                .HasOne(u => u.Sender)
                                .WithMany(s => s.MessagesSent)
                                .HasForeignKey(s => s.SenderId)
                                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<Message>()
                                .HasOne(u => u.Recipient)
                                .WithMany(s => s.MessagesReceived)
                                .HasForeignKey(s => s.ReciptientId)
                                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.ApplyUtcDateTimeConverter();

        }

        // public DbSet<AppUser> Users { get; set; }
        public DbSet<UserLike> Like { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Connection> Connections { get; set; }

    }

    public static class UtcDateAnnotation
    {
        private const string IsUtcAnnotation = "IsUtc";
        private static readonly ValueConverter<DateTime, DateTime> UtcConverter =
            new ValueConverter<DateTime, DateTime>(v => v, v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

        public static PropertyBuilder<TProperty> IsUtc<TProperty>(this PropertyBuilder<TProperty> builder, bool isUtc = true) =>
            builder.HasAnnotation(IsUtcAnnotation, isUtc);

        public static bool IsUtc(this IMutableProperty property) =>
            ((bool?)property.FindAnnotation(IsUtcAnnotation)?.Value) ?? true;

        /// <summary>
        /// Make sure this is called after configuring all your entities.
        /// </summary>
        public static void ApplyUtcDateTimeConverter(this ModelBuilder builder)
        {
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (!property.IsUtc())
                    {
                        continue;
                    }

                    if (property.ClrType == typeof(DateTime) ||
                        property.ClrType == typeof(DateTime?))
                    {
                        property.SetValueConverter(UtcConverter);
                    }
                }
            }
        }
    }
}