import { getFeatureKeyByValue, featureMap, FEATURES } from './generic-multi-feature-layout.mapping';
import { GENERIC_LABELS } from './generic-multi-feature-layout.constants';

describe('Generic Multi Feature Layout', () => {
  describe('getFeatureKeyByValue', () => {
    it('should return the correct feature key for a valid value', () => {
      expect(getFeatureKeyByValue('thumbnail-generation')).toBe('THUMBNAIL_GENERATION');
    });

    it('should return undefined for an invalid value', () => {
      expect(getFeatureKeyByValue('invalid-value')).toBeUndefined();
    });
  });

  describe('featureMap', () => {
    it('should return correct labels and data for DOCUMENT tab type in THUMBNAIL_GENERATION', () => {
      const result = featureMap()[FEATURES.THUMBNAIL_GENERATION](GENERIC_LABELS.DOCUMENT);
      expect(result.labels.pageTitle).toBe('Generate the thumbnail of a single document'); 
      expect(result.data.bodyParam.query).toBe("ecm:mixinType = 'Thumbnail' AND ecm:path='{query}'"); 
    });

    it('should return correct labels and data for FOLDER tab type in THUMBNAIL_GENERATION', () => {
      const result = featureMap()[FEATURES.THUMBNAIL_GENERATION](GENERIC_LABELS.FOLDER);
      expect(result.labels.pageTitle).toBe('Generate the thumbnail of a document and all of its children');   
      expect(result.data.bodyParam.query).toBe("ecm:mixinType = 'Thumbnail' AND ecm:uuid='{query}' OR ecm:ancestorId='{query}' AND ecm:isProxy = 0 AND ecm:mixinType != 'HiddenInNavigation' AND ecm:isVersion = 0 AND ecm:isTrashed = 0");
    });

    it('should throw an error for unsupported tab type in THUMBNAIL_GENERATION', () => {
      expect(() => featureMap()[FEATURES.THUMBNAIL_GENERATION]('unsupported')).toThrowError('Unsupported type: unsupported');
    });
  });
});
