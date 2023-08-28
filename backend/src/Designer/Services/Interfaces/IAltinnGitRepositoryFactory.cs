using Altinn.Studio.Designer.Infrastructure.GitRepository;
using Altinn.Studio.Designer.Models;

namespace Altinn.Studio.Designer.Services.Interfaces
{
    /// <summary>
    /// Interface for handling the creation of AltinnGitRepository instances.
    /// </summary>
    public interface IAltinnGitRepositoryFactory
    {
        /// <summary>
        /// Creates an instance of <see cref="AltinnGitRepository"/>
        /// </summary>
        /// <param name="appContext"> An <see cref="AltinnAppContext"/></param>
        AltinnGitRepository GetAltinnGitRepository(AltinnAppContext appContext);

        /// <summary>
        /// Creates an instance of <see cref="AltinnAppGitRepository"/>
        /// </summary>
        /// <param name="appContext"> An <see cref="AltinnAppContext"/></param>
        AltinnAppGitRepository GetAltinnAppGitRepository(AltinnAppContext appContext);
    }
}
