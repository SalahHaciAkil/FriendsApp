using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
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

        }

        public DbSet<AppUser> Users { get; set; }
        public DbSet<UserLike> Like { get; set; }
        public DbSet<Message> Messages { get; set; }


    }
}