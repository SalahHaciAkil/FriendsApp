using System.Threading.Tasks;

namespace API.interfaces
{
    public interface IUnitOfWork
    {
        IUserRepo UserRepo { get;}
        IMessageRepo messageRepo { get;}
        ILikesRepo LikeRepo { get;}

        Task<bool> Complete();
        bool HasChanges();
        
    }
}