using System;
using System.Text.RegularExpressions;
using Altinn.Studio.Designer.Helpers;

namespace Altinn.Studio.Designer.Models
{
    public class AltinnRepo
    {
        /// <summary>
        /// The organization owning the repository identfied by it's short name as defined in Gitea.
        /// </summary>
        public string Org { get; }
        /// <summary>
        /// The name of the repository as specified in Gitea.
        /// </summary>
        public string App { get; }

        public AltinnRepo(string org, string app)
        {
            ValidateOrganization(org);
            Guard.AssertValidAppRepoName(app);
            Org = org;
            App = app;
        }

        private void ValidateOrganization(string org)
        {
            if (!Regex.IsMatch(org, "^[a-zA-Z0-9][a-zA-Z0-9-_\\.]*$"))
            {
                throw new ArgumentException("Provided organization name is not valid");
            }
        }
    }
}
