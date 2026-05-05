// Kyro AI Engine - Rule-based decision engine
const websiteTypeRules = {
  basic: {
    description: 'Basic website with static pages',
    modules: ['pages']
  },
  ecommerce: {
    description: 'E-commerce website with products, cart, payments',
    modules: ['products', 'cart', 'payments']
  },
  social: {
    description: 'Social network with users, posts, connections',
    modules: ['users', 'posts', 'connections']
  },
  blog: {
    description: 'Blog with posts and comments',
    modules: ['posts', 'comments']
  }
};

const featureRules = {
  auth: {
    description: 'Authentication system',
    modules: ['auth'],
    dependencies: []
  },
  payments: {
    description: 'Payment processing',
    modules: ['payments'],
    dependencies: []
  },
  admin: {
    description: 'Admin dashboard',
    modules: ['admin'],
    dependencies: ['auth']
  }
};

const moduleDefinitions = {
  pages: {
    name: 'pages',
    files: [
      { path: 'frontend/pages/home.html', template: 'home-page.html' },
      { path: 'frontend/pages/about.html', template: 'about-page.html' }
    ]
  },
  auth: {
    name: 'auth',
    files: [
      { path: 'backend/middleware/auth.js', template: 'auth-middleware.js' },
      { path: 'backend/models/user.model.js', template: 'user-model.js' }
    ]
  },
  payments: {
    name: 'payments',
    files: [
      { path: 'backend/services/payment.service.js', template: 'payment-service.js' },
      { path: 'backend/routes/payment.routes.js', template: 'payment-routes.js' }
    ]
  },
  admin: {
    name: 'admin',
    files: [
      { path: 'backend/controllers/admin.controller.js', template: 'admin-controller.js' },
      { path: 'backend/routes/admin.routes.js', template: 'admin-routes.js' }
    ]
  },
  products: {
    name: 'products',
    files: [
      { path: 'backend/models/product.model.js', template: 'product-model.js' },
      { path: 'backend/routes/product.routes.js', template: 'product-routes.js' }
    ]
  },
  cart: {
    name: 'cart',
    files: [
      { path: 'backend/services/cart.service.js', template: 'cart-service.js' }
    ]
  },
  posts: {
    name: 'posts',
    files: [
      { path: 'backend/models/post.model.js', template: 'post-model.js' },
      { path: 'backend/routes/post.routes.js', template: 'post-routes.js' }
    ]
  },
  comments: {
    name: 'comments',
    files: [
      { path: 'backend/models/comment.model.js', template: 'comment-model.js' }
    ]
  },
  users: {
    name: 'users',
    files: [
      { path: 'backend/models/user.model.js', template: 'user-model.js' },
      { path: 'backend/routes/user.routes.js', template: 'user-routes.js' }
    ]
  },
  connections: {
    name: 'connections',
    files: [
      { path: 'backend/models/connection.model.js', template: 'connection-model.js' }
    ]
  }
};

function resolveDependencies(features) {
  const resolved = new Set(features);
  let changed = true;
  
  while (changed) {
    changed = false;
    resolved.forEach(feature => {
      const deps = featureRules[feature]?.dependencies || [];
      deps.forEach(dep => {
        if (!resolved.has(dep)) {
          resolved.add(dep);
          changed = true;
        }
      });
    });
  }
  
  return Array.from(resolved);
}

function generatePlan(userConfig) {
  const { websiteType, features, techPreferences } = userConfig;
  
  if (!websiteTypeRules[websiteType]) {
    throw new Error(`Invalid website type: ${websiteType}`);
  }
  
  const resolvedFeatures = resolveDependencies(features);
  const modules = new Set();
  
  const websiteModules = websiteTypeRules[websiteType].modules;
  websiteModules.forEach(mod => modules.add(mod));
  
  resolvedFeatures.forEach(feature => {
    const featureModules = featureRules[feature]?.modules || [];
    featureModules.forEach(mod => modules.add(mod));
  });
  
  const plan = {
    websiteType,
    originalFeatures: features,
    resolvedFeatures,
    modules: Array.from(modules).map(moduleName => {
      const moduleDef = moduleDefinitions[moduleName];
      if (!moduleDef) {
        return { name: moduleName, files: [] };
      }
      return {
        name: moduleName,
        files: moduleDef.files
      };
    })
  };
  
  return plan;
}

module.exports = { generatePlan };
