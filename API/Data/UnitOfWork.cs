using System.Threading.Tasks;
using API.interfaces;
using API.Services;
using AutoMapper;

namespace API.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext context;
        private readonly IMapper mapper;
        public UnitOfWork(DataContext context, IMapper mapper)
        {
            this.mapper = mapper;
            this.context = context;
        }

        public IUserRepo UserRepo => new UserRepo(this.context, this.mapper);

        public IMessageRepo messageRepo => new MessageRepo(this.context, this.mapper);

        public ILikesRepo LikeRepo => new LikesRepo(this.context);

        public async Task<bool> Complete()
        {
            return await this.context.SaveChangesAsync() > 0;
        }

        public bool HasChanges()
        {
            this.context.ChangeTracker.DetectChanges();
            var changes = this.context.ChangeTracker.HasChanges();

            return changes;
        }
    }
}