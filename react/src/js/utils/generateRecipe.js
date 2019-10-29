// Initialize light spectrums
const LIGHT_SPECTRUMS = {
  white: { '380-399': 2.03, '400-499': 20.30, '500-599': 23.27, '600-700': 31.09, '701-780': 23.31 },
  red: { '380-399': 0.0, '400-499': 0.0, '500-599': 0.0, '600-700': 100.0, '701-780': 0.0 },
  green: { '380-399': 0.0, '400-499': 0.0, '500-599': 100.0, '600-700': 0.0, '701-780': 0.0 },
  blue: { '380-399': 0.0, '400-499': 100.0, '500-599': 0.0, '600-700': 0.0, '701-780': 0.0 },
  purple: { '380-399': 0.0, '400-499': 50.0, '500-599': 0.0, '600-700': 50.0, '701-780': 0.0 },
  night: { '380-399': 0.0, '400-499': 0.0, '500-599': 0.0, '600-700': 0.0, '701-780': 0.0 },
};

// Initialize image urls
const IMAGE_URLS = {
  white: 'https://storage.googleapis.com/openag-recipe-images/get_growing_white.png',
  red: 'https://storage.googleapis.com/openag-recipe-images/get_growing_red.png',
  green: 'https://storage.googleapis.com/openag-recipe-images/get_growing_green.png',
  blue: 'https://storage.googleapis.com/openag-recipe-images/get_growing_blue.png',
  purple: 'https://storage.googleapis.com/openag-recipe-images/get_growing_purple.png',
};

export default function generateRecipe(user, rawRecipe) {
  console.log('Generating recipe from:', rawRecipe);

  // Get parameters
  const {
    name, description, duration, dayLength, nightLength, lightIntensity, lightSpectrum,
  } = rawRecipe;

  // Validate recipe parameters
  if (!name || !description || !duration || !dayLength || !nightLength || !lightIntensity || !lightSpectrum) {
    console.error('Invalid recipe parameters, rawRecipe:', rawRecipe);
    return {};
  }

  // Validate user parameters
  if (!user || !user.name || !user.email || !user.uuid) {
    console.error('Invalid user parameters, user: ', user);
    return {};
  }

  // Initialize recipe
  const recipe = {
    format: 'openag-phased-environment-v1',
    version: '1',
    creation_timestamp_utc: new Date().toISOString(),
    name,
    parent_recipe_uuid: null,
    support_recipe_uuids: null,
    description: {
      brief: description,
      verbose: description + ' Assumes a linear growth rate from 2-18 cm during the first 4 weeks and a fixed plant height of 18 cm over the remaining weeks.',
    },
    image_url: IMAGE_URLS[lightSpectrum],
    authors: [
      {
        name: user.name,
        email: user.email,
        uuid: user.uuid,
      }
    ],
    cultivars: [
      {
        name: 'Genovese Basil',
        uuid: '9dc80135-0c24-4a65-ae0b-95f1c5e53676'
      }
    ],
    cultivation_methods: [
      {
        name: 'Shallow Water Culture',
        uuid: '30cbbded-07a7-4c49-a47b-e34fc99eefd0'
      }
    ],
    environments: {
      day_week1: {
        name: 'Daytime Week 1',
        light_spectrum_nm_percent: LIGHT_SPECTRUMS[lightSpectrum],
        light_ppfd_umol_m2_s: parseFloat(lightIntensity),
        light_illumination_distance_cm: 18
      },
      day_week2: {
        name: 'Daytime Week 2',
        light_spectrum_nm_percent: LIGHT_SPECTRUMS[lightSpectrum],
        light_ppfd_umol_m2_s: parseFloat(lightIntensity),
        light_illumination_distance_cm: 14
      },
      day_week3: {
        name: 'Daytime Week 3',
        light_spectrum_nm_percent: LIGHT_SPECTRUMS[lightSpectrum],
        light_ppfd_umol_m2_s: parseFloat(lightIntensity),
        light_illumination_distance_cm: 10
      },
      day_week4: {
        name: 'Daytime Week 4',
        light_spectrum_nm_percent: LIGHT_SPECTRUMS[lightSpectrum],
        light_ppfd_umol_m2_s: parseFloat(lightIntensity),
        light_illumination_distance_cm: 6
      },
      night: {
        name: 'Night',
        light_spectrum_nm_percent: LIGHT_SPECTRUMS.night,
        light_ppfd_umol_m2_s: 0,
        light_illumination_distance_cm: 15
      }
    },
    phases: [],
  };

  // Generate remaining environments
  if (duration > 4) {
    recipe.environments.day_remaining_weeks = {
      name: `Daytime Week 5-${duration}`,
      light_spectrum_nm_percent: LIGHT_SPECTRUMS[lightSpectrum],
      light_ppfd_umol_m2_s: parseFloat(lightIntensity),
      light_illumination_distance_cm: 2
    };
  };

  // Generate remaining environments & phases
  for (let week = 1; week <= duration; week++) {
    recipe.phases.push({
      name: `Week ${week}`,
      repeat: 6,
      cycles: [
        {
          name: `Daytime Week ${week}`,
          environment: week > 4 ? 'day_remaining_weeks' : `day_week${week}`,
          duration_hours: parseFloat(dayLength),
        },
        {
          name: 'Night',
          environment: 'night',
          duration_hours: nightLength,
        }
      ]
    });
  }

  // Successfully generated recipe
  console.log('Generated recipe:', JSON.stringify(recipe));
  return recipe;
}