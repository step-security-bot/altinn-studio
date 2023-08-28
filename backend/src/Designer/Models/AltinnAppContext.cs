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
        public string Org { get; }
        public string App { get; }
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
