using System.Globalization;

namespace RealEstate3D.Helpers
{
    public static class CurrencyHelper
    {
        private const decimal USD_TO_KGS_RATE = 87.5M;

        public static string FormatKyrgyzCurrency(decimal amount)
        {
            var kgsFormatted = amount.ToString("N0", CultureInfo.InvariantCulture) + " сом";
            var usdAmount = Math.Round(amount / USD_TO_KGS_RATE, 0);
            var usdFormatted = "$" + usdAmount.ToString("N0", CultureInfo.InvariantCulture);
            
            return $"{kgsFormatted} ({usdFormatted})";
        }

        public static string FormatKyrgyzCurrencyShort(decimal amount)
        {
            if (amount >= 1000000)
            {
                var millions = Math.Round(amount / 1000000M, 1);
                var millionsUsd = Math.Round(millions * 1000000M / USD_TO_KGS_RATE / 1000000M, 1);
                return $"{millions:0.#} млн сом (${millionsUsd:0.#}M)";
            }
            else if (amount >= 1000)
            {
                var thousands = Math.Round(amount / 1000M, 0);
                var thousandsUsd = Math.Round(thousands * 1000M / USD_TO_KGS_RATE / 1000M, 0);
                return $"{thousands} тыс сом (${thousandsUsd}K)";
            }
            else
            {
                return FormatKyrgyzCurrency(amount);
            }
        }

        public static decimal ConvertToUsd(decimal kgsAmount)
        {
            return Math.Round(kgsAmount / USD_TO_KGS_RATE, 2);
        }

        public static decimal ConvertToKgs(decimal usdAmount)
        {
            return Math.Round(usdAmount * USD_TO_KGS_RATE, 0);
        }
    }
}