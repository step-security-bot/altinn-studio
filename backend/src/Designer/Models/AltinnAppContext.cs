using System;
using System.Text.RegularExpressions;
using Altinn.Studio.Designer.Helpers;

namespace Altinn.Studio.Designer.Models
{
    /// <summary>
    /// Context of an app. Holding information about org, app and developer
    /// </summary>
    public class AltinnAppContext
    {
        /// <summary>
        /// The organization owning the repository identfied by it's short name as defined in Gitea.
        /// </summary>
        public string Org { get; }
        /// <summary>
        /// The name of the repository as specified in Gitea.
        /// </summary>
        public string App { get; }
        /// <summary>
        /// The user name of the developer working on the repository.
        /// </summary>
        public string Developer { get; }

        public AltinnAppContext(string org, string app, string developer)
        {
            Guard.AssertValidAppRepoName(app);
            ValidateDeveloper(developer);
            ValidateOrganization(org);

            Org = org;
            App = app;
            Developer = developer;
        }

        private static void ValidateDeveloper(string developer)
        {
            if (!Regex.IsMatch(developer, "^[a-zA-Z0-9][a-zA-Z0-9-_\\.]*$"))
            {
                throw new ArgumentException("Provided developer name is not valid");
            }
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
